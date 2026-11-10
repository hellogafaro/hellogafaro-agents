import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile, cp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { disableModelInvocation, normalizeNotionMarkdown } from "./markdown.mjs";
import { createNotion } from "./notion.mjs";

const root = path.resolve(import.meta.dirname, "..");

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/u);
  if (!match) throw new Error("SKILL.md must start with YAML frontmatter.");

  const data = {};
  const lines = match[1].split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const pair = lines[index].match(/^([a-zA-Z0-9_-]+):\s*(.*)$/u);
    if (!pair) continue;

    const [, key, value] = pair;
    if (/^[|>][-+]?$/u.test(value)) {
      const parts = [];
      while (lines[index + 1]?.startsWith("  ")) {
        parts.push(lines[index + 1].slice(2));
        index += 1;
      }
      data[key] = parts.join("\n");
      continue;
    }

    data[key] = value.replace(/^["']|["']$/gu, "");
  }

  return data;
}

export function assertArchivePaths(entries) {
  if (entries.length === 0) throw new Error("Notion returned an empty skill archive.");

  for (const entry of entries) {
    const normalized = entry.replaceAll("\\", "/");
    const segments = normalized.split("/").filter(Boolean);
    if (normalized.startsWith("/") || segments.includes("..") || normalized.includes("\0")) {
      throw new Error(`Unsafe archive path: ${entry}`);
    }
  }
}

async function findSkillFile(directory) {
  const entries = execFileSync("find", [directory, "-type", "f", "-name", "SKILL.md"], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter(Boolean);

  if (entries.length !== 1) {
    throw new Error(`Expected one SKILL.md in the archive, found ${entries.length}.`);
  }

  return entries[0];
}

function normalizeId(value) {
  return value.replaceAll("-", "").toLowerCase();
}

async function downloadSkill(page, notion, directory) {
  let archiveRef;
  try {
    archiveRef = await notion.request(`/ai/skills/${page.id}`);
  } catch (error) {
    if (error.status === 400 && error.message.includes("is not a skill")) {
      console.log(`Skipping ${page.id}: Notion does not treat this page as a skill.`);
      return null;
    }
    throw error;
  }
  const response = await fetch(archiveRef.url);
  if (!response.ok) throw new Error(`Skill archive download failed (${response.status}).`);

  const archive = path.join(directory, `${page.id}.tar.gz`);
  const extracted = path.join(directory, page.id);
  await writeFile(archive, Buffer.from(await response.arrayBuffer()));
  await mkdir(extracted);

  const archiveEntries = execFileSync("tar", ["-tzf", archive], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
  assertArchivePaths(archiveEntries);
  const archiveTypes = execFileSync("tar", ["-tvzf", archive], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
  if (archiveTypes.some((entry) => entry[0] !== "-" && entry[0] !== "d")) {
    throw new Error(`Skill archive ${page.id} contains links or special files.`);
  }
  execFileSync("tar", ["-xzf", archive, "-C", extracted, "--no-same-owner", "--no-same-permissions"]);

  const skillFile = await findSkillFile(extracted);
  const metadata = parseFrontmatter(await readFile(skillFile, "utf8"));
  const name = metadata.name?.trim();
  if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name)) {
    throw new Error(`Invalid exported skill name for page ${page.id}.`);
  }
  if (!metadata.description?.trim()) throw new Error(`Skill ${name} has no description.`);
  if (normalizeId(metadata.notion_page_id ?? "") !== normalizeId(page.id)) {
    throw new Error(`Exported page ID does not match ${page.id}.`);
  }

  return { name, directory: path.dirname(skillFile), skillFile };
}

/** Returns false only when the Notion Skills page has its Auto-invoke checkbox unticked. */
export function isAutoInvoked(page) {
  return page.properties?.["Auto-invoke"]?.checkbox !== false;
}

/** Rejects a global instructions export that is empty, cut short or missing its title. */
export function assertInstructions(markdown) {
  if (!markdown.startsWith("# ")) throw new Error("Global instructions must start with a level-one heading.");
  if (markdown.split("\n").filter((line) => line.trim()).length < 10) {
    throw new Error("Global instructions export is too short to be complete.");
  }
}

/** Reads the repository's Notion IDs from agents.json. */
export async function getConfig(directory = root) {
  const config = JSON.parse(await readFile(path.join(directory, "agents.json"), "utf8"));
  for (const key of ["instructions", "skills", "projects"]) {
    if (!/^[0-9a-f-]{32,36}$/iu.test(config[key] ?? "")) throw new Error(`agents.json needs a Notion ID for "${key}".`);
  }
  return config;
}

async function main() {
  const notion = createNotion(required("NOTION_ACCESS_TOKEN"));
  const config = await getConfig();
  const temporary = await mkdtemp(path.join(os.tmpdir(), "notion-agents-sync-"));
  const stagedSkills = path.join(temporary, "skills");
  const stagedInstructions = path.join(temporary, "instructions");

  try {
    await mkdir(stagedSkills);
    await mkdir(stagedInstructions);
    const pages = await notion.queryDataSource(config.skills);
    if (pages.length === 0) throw new Error("The Notion Skills database returned no pages.");

    const names = new Set();
    const manual = [];
    for (const page of pages) {
      const skill = await downloadSkill(page, notion, temporary);
      if (!skill) continue;
      if (names.has(skill.name)) throw new Error(`Duplicate exported skill name: ${skill.name}`);
      names.add(skill.name);
      if (!isAutoInvoked(page)) {
        await writeFile(skill.skillFile, disableModelInvocation(await readFile(skill.skillFile, "utf8")));
        manual.push(skill.name);
      }
      await cp(skill.directory, path.join(stagedSkills, skill.name), { recursive: true });
    }
    if (names.size === 0) throw new Error("Notion exported no skills.");

    const instructions = normalizeNotionMarkdown(await notion.getPageMarkdown(config.instructions));
    assertInstructions(instructions);
    await writeFile(path.join(stagedInstructions, "AGENTS.md"), instructions);

    for (const [staged, name] of [
      [stagedSkills, "skills"],
      [stagedInstructions, "instructions"],
    ]) {
      const destination = path.join(root, name);
      await rm(destination, { recursive: true, force: true });
      await cp(staged, destination, { recursive: true });
    }
    console.log(`Synced ${names.size} skills (${manual.length} without auto-invoke: ${manual.join(", ") || "none"}) and the global instructions from Notion.`);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await main();
}
