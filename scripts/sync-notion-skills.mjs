import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile, cp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const notionApi = "https://api.notion.com/v1";
const notionVersion = "2026-03-11";
const root = path.resolve(import.meta.dirname, "..");

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

async function notionRequest(pathname, token, init = {}) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(`${notionApi}${pathname}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": notionVersion,
        ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
      },
    });

    if (response.ok) return response.json();
    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const delay = Number.isFinite(retryAfter) ? retryAfter * 1_000 : 1_000 * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    const body = await response.text();
    throw Object.assign(new Error(`Notion ${pathname} failed (${response.status}): ${body.slice(0, 500)}`), {
      status: response.status,
    });
  }

  throw new Error(`Notion ${pathname} failed after retries.`);
}

async function getSkillPages(dataSourceId, token) {
  const pages = [];
  let cursor;

  do {
    const response = await notionRequest(`/data_sources/${dataSourceId}/query`, token, {
      method: "POST",
      body: JSON.stringify({
        page_size: 100,
        ...(cursor === undefined ? {} : { start_cursor: cursor }),
      }),
    });

    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor !== undefined && cursor !== null);

  return pages;
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

async function downloadSkill(page, token, directory) {
  let archiveRef;
  try {
    archiveRef = await notionRequest(`/ai/skills/${page.id}`, token);
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
  if (normalizeId(metadata.notion_page_id ?? "") !== normalizeId(page.id)) {
    throw new Error(`Exported page ID does not match ${page.id}.`);
  }

  return { name, directory: path.dirname(skillFile) };
}

async function main() {
  const token = required("NOTION_ACCESS_TOKEN");
  const dataSourceId = required("NOTION_SKILLS_DATA_SOURCE_ID");
  const temporary = await mkdtemp(path.join(os.tmpdir(), "notion-skills-sync-"));
  const stagedSkills = path.join(temporary, "skills");

  try {
    await mkdir(stagedSkills);
    const pages = await getSkillPages(dataSourceId, token);
    if (pages.length === 0) throw new Error("The Notion Skills database returned no pages.");

    const names = new Set();
    for (const page of pages) {
      const skill = await downloadSkill(page, token, temporary);
      if (!skill) continue;
      if (names.has(skill.name)) throw new Error(`Duplicate exported skill name: ${skill.name}`);
      names.add(skill.name);
      await cp(skill.directory, path.join(stagedSkills, skill.name), { recursive: true });
    }

    const destination = path.join(root, "skills");
    await rm(destination, { recursive: true, force: true });
    await cp(stagedSkills, destination, { recursive: true });
    console.log(`Synced ${names.size} skills from Notion.`);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await main();
}
