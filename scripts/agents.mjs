#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeNotionMarkdown } from "./markdown.mjs";
import { createNotion, getPlainText } from "./notion.mjs";
import { getRepos, renderProjectAgents } from "./project.mjs";

const unit = "hellogafaro-agents";
const legacyTimer = "skills-sync.timer";
const infisicalProject = "88269636-bd9f-447a-a1fd-b788edc4895e";
const instructionsTitle = "agent instructions";
const folderPattern = /^[a-z0-9][a-z0-9._-]*$/iu;
const usage = "Usage: agents.mjs <install|update|remove|status> [--home DIR] [--repo DIR] [--systemctl CMD]";
const exitLocked = 75;

class StopError extends Error {}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = {};
  for (let index = 0; index < rest.length; index += 1) {
    const match = rest[index].match(/^--(home|repo|systemctl)(?:=(.*))?$/u);
    if (!match) throw new StopError(`Unknown argument ${rest[index]}.\n${usage}`);
    flags[match[1]] = match[2] ?? rest[(index += 1)];
    if (!flags[match[1]]) throw new StopError(`--${match[1]} needs a value.`);
  }
  return { command, flags };
}

function getContext(flags) {
  const home = path.resolve(flags.home ?? process.env.HOME ?? os.homedir());
  const repo = path.resolve(flags.repo ?? path.join(import.meta.dirname, ".."));
  const state = path.join(home, ".local/state", unit);
  return {
    home,
    repo,
    state,
    flags,
    projects: path.join(home, "projects"),
    agents: path.join(home, ".agents"),
    skills: path.join(home, ".agents/skills"),
    units: path.join(home, ".config/systemd/user"),
    manifestPath: path.join(state, "manifest.json"),
    lastRunPath: path.join(state, "last-run.json"),
    logPath: path.join(state, "update.log"),
    lockPath: path.join(state, "lock"),
    systemctl: flags.systemctl ?? "systemctl",
    stamp: new Date().toISOString().replaceAll(":", "-").replace(/\.\d+Z$/u, "Z"),
  };
}

function createLog(context) {
  const entries = { errors: [], warnings: [], changes: [] };
  fs.mkdirSync(context.state, { recursive: true });
  if ((fs.statSync(context.logPath, { throwIfNoEntry: false })?.size ?? 0) > 1_000_000) {
    fs.renameSync(context.logPath, `${context.logPath}.1`);
  }
  const write = (level, message) => {
    fs.appendFileSync(context.logPath, `${new Date().toISOString()} ${level} ${message}\n`);
    (level === "info" ? console.log : console.error)(`${level === "info" ? "" : `${level}: `}${message}`);
  };
  return {
    entries,
    info: (message) => write("info", message),
    change: (message) => {
      entries.changes.push(message);
      write("info", message);
    },
    warn: (message) => {
      entries.warnings.push(message);
      write("warn", message);
    },
    error: (message) => {
      entries.errors.push(message);
      write("error", message);
    },
  };
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw new StopError(`${file} is not valid JSON: ${error.message}`);
  }
}

function hash(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function lstat(file) {
  return fs.lstatSync(file, { throwIfNoEntry: false });
}

function writeAtomic(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp-${process.pid}`;
  const descriptor = fs.openSync(temporary, "w", 0o644);
  try {
    fs.writeSync(descriptor, content);
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
  fs.renameSync(temporary, file);
}

function writeJson(file, value) {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) return;
  writeAtomic(file, content);
}

function linkAtomic(target, link) {
  const temporary = `${link}.tmp-${process.pid}`;
  fs.rmSync(temporary, { force: true });
  fs.symlinkSync(target, temporary);
  fs.renameSync(temporary, link);
}

function readLinkTarget(link) {
  return path.resolve(path.dirname(link), fs.readlinkSync(link));
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function git(context, args) {
  const result = spawnSync("git", ["-C", context.repo, ...args], { encoding: "utf8" });
  return { ok: result.status === 0, out: (result.stdout ?? "").trim(), err: (result.stderr ?? "").trim() };
}

function systemctl(context, args) {
  const result = spawnSync(context.systemctl, ["--user", ...args], { encoding: "utf8" });
  return { ok: result.status === 0, out: (result.stdout ?? "").trim(), err: (result.stderr ?? result.error?.message ?? "").trim() };
}

/** Moves or copies an entry into the run's backup folder and returns the backup path. */
function backup(context, file, { move = false } = {}) {
  const relative = isInside(file, context.home) ? path.relative(context.home, file) : file.replace(/^\/+/u, "");
  const destination = path.join(context.state, "backups", context.stamp, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const stats = lstat(file);
  if (move || stats.isDirectory()) fs.renameSync(file, destination);
  else if (stats.isSymbolicLink()) fs.symlinkSync(fs.readlinkSync(file), destination);
  else fs.copyFileSync(file, destination);
  return destination;
}

function acquireLock(context) {
  fs.mkdirSync(context.state, { recursive: true });
  const descriptor = fs.openSync(context.lockPath, "a");
  const result = spawnSync("flock", ["--nonblock", "3"], { stdio: ["ignore", "ignore", "inherit", descriptor] });
  if (result.status === 0) return descriptor;
  fs.closeSync(descriptor);
  return null;
}

function checkCheckout(context, log) {
  if (!git(context, ["rev-parse", "--is-inside-work-tree"]).ok) throw new StopError(`${context.repo} is not a git checkout.`);
  const status = git(context, ["status", "--porcelain"]);
  if (!status.ok || status.out) {
    throw new StopError(`Checkout ${context.repo} has local changes; not updating. Commit or discard them by hand (this tool never resets).`);
  }
  const fetch = git(context, ["fetch", "--quiet"]);
  if (!fetch.ok) {
    log.error(`git fetch failed in ${context.repo}: ${fetch.err}; using the current checkout.`);
    return;
  }
  const upstream = git(context, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
  if (!upstream.ok) throw new StopError(`Checkout ${context.repo} has no upstream branch; not updating.`);
  const [ahead, behind] = git(context, ["rev-list", "--left-right", "--count", "HEAD...@{u}"]).out.split(/\s+/u).map(Number);
  if (ahead > 0) {
    throw new StopError(`Checkout ${context.repo} has ${ahead} local commit(s) not on ${upstream.out}; not updating. Resolve it by hand (this tool never resets).`);
  }
  if (behind > 0) {
    const before = git(context, ["rev-parse", "--short", "HEAD"]).out;
    const pull = git(context, ["pull", "--ff-only", "--quiet"]);
    if (!pull.ok) throw new StopError(`git pull --ff-only failed in ${context.repo}: ${pull.err}`);
    log.change(`Pulled ${context.repo} ${before}..${git(context, ["rev-parse", "--short", "HEAD"]).out}.`);
  }
}

function getExport(context) {
  const skillsDirectory = path.join(context.repo, "skills");
  const skills = fs.existsSync(skillsDirectory)
    ? fs
        .readdirSync(skillsDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(entry.name))
        .filter((entry) => fs.existsSync(path.join(skillsDirectory, entry.name, "SKILL.md")))
        .map((entry) => entry.name)
        .sort()
    : [];
  const instructions = path.join(context.repo, "instructions/AGENTS.md");
  return { skills, skillsDirectory, instructions: (lstat(instructions)?.size ?? 0) > 0 ? instructions : null };
}

function ensureLink(context, manifest, link, target, log) {
  const entry = manifest.links[link];
  const stats = lstat(link);
  let original = entry?.original ?? null;

  if (stats?.isSymbolicLink() && readLinkTarget(link) === target) {
    manifest.links[link] = { target, created: entry?.created ?? false, original };
    return;
  }
  if (stats && !(stats.isSymbolicLink() && entry && readLinkTarget(link) === entry.target)) {
    const saved = backup(context, link, { move: stats.isDirectory() });
    if (!entry) original = saved;
    log.warn(`${link} was ${stats.isSymbolicLink() ? `a link to ${fs.readlinkSync(saved)}` : `a real ${stats.isDirectory() ? "folder" : "file"}`}; backed up to ${saved}.`);
  }
  fs.mkdirSync(path.dirname(link), { recursive: true });
  linkAtomic(target, link);
  manifest.links[link] = { target, created: entry?.created ?? true, original };
  log.change(`Linked ${link} -> ${target}.`);
}

function syncLinks(context, manifest, log) {
  const exported = getExport(context);
  if (exported.instructions) ensureLink(context, manifest, path.join(context.agents, "AGENTS.md"), exported.instructions, log);
  else log.error(`${context.repo}/instructions/AGENTS.md is missing or empty; left ${context.agents}/AGENTS.md unchanged.`);

  if (exported.skills.length === 0) {
    log.error(`${context.repo}/skills exports no skills; left ${context.skills} unchanged.`);
    return;
  }
  for (const name of exported.skills) {
    ensureLink(context, manifest, path.join(context.skills, name), path.join(exported.skillsDirectory, name), log);
  }

  for (const name of fs.readdirSync(context.skills)) {
    const link = path.join(context.skills, name);
    if (!lstat(link).isSymbolicLink()) continue;
    const target = readLinkTarget(link);
    const ours = isInside(target, exported.skillsDirectory) || manifest.links[link]?.target === target;
    if (!ours || fs.existsSync(target)) continue;
    fs.unlinkSync(link);
    delete manifest.links[link];
    log.change(`Removed ${link}; ${target} no longer exists.`);
  }
  for (const link of Object.keys(manifest.links)) {
    if (!lstat(link)) delete manifest.links[link];
  }
}

function getTitle(page) {
  return getPlainText(Object.values(page.properties ?? {}).find((property) => property.type === "title")).trim();
}

async function getProjects(context, notion, config, log) {
  const pages = await notion.queryDataSource(config.projects, {
    filter: { property: "Folder", rich_text: { is_not_empty: true } },
  });
  const byFolder = new Map();
  for (const page of pages) {
    if (page.in_trash || page.archived) continue;
    const folder = getPlainText(page.properties?.Folder).trim();
    if (!folder) continue;
    if (!folderPattern.test(folder) || folder.includes("..")) {
      log.warn(`Notion project "${getTitle(page)}" has an invalid Folder "${folder}"; skipped.`);
      continue;
    }
    byFolder.set(folder, [...(byFolder.get(folder) ?? []), page]);
  }

  const projects = [];
  const held = new Set();
  for (const [folder, matches] of [...byFolder].sort(([a], [b]) => (a < b ? -1 : 1))) {
    if (matches.length > 1) {
      held.add(folder);
      log.error(`Folder "${folder}" is set on ${matches.length} Notion projects (${matches.map(getTitle).join(", ")}); skipped and kept its files.`);
      continue;
    }
    const [page] = matches;
    const directory = path.join(context.projects, folder);
    if (!lstat(directory)?.isDirectory()) {
      log.warn(`Notion project "${getTitle(page)}" points to ${directory}, which does not exist; skipped.`);
      continue;
    }
    const children = (await notion.getChildren(page.id)).filter(
      (block) => block.type === "child_page" && block.child_page?.title?.trim().toLowerCase() === instructionsTitle && !block.in_trash,
    );
    if (children.length > 1) log.warn(`Notion project "${getTitle(page)}" has ${children.length} "Agent instructions" pages; using the first.`);
    if (children.length === 0) log.warn(`Notion project "${getTitle(page)}" has no "Agent instructions" page.`);
    const instructions = children[0]
      ? { id: children[0].id, markdown: normalizeNotionMarkdown(await notion.getPageMarkdown(children[0].id)) }
      : null;
    projects.push({ folder, directory, id: page.id, url: page.url, name: getTitle(page) || folder, instructions });
  }
  return { projects, held };
}

function writeManaged(context, manifest, file, content, log) {
  const entry = manifest.files[file];
  const stats = lstat(file);
  let original = entry?.original ?? null;

  if (stats && !stats.isFile()) {
    const saved = backup(context, file, { move: true });
    if (!entry) original = saved;
    log.warn(`${file} was not a regular file; backed up to ${saved}.`);
  } else if (stats) {
    const current = fs.readFileSync(file, "utf8");
    if (current === content) {
      manifest.files[file] = { hash: hash(content), created: entry?.created ?? false, original };
      return;
    }
    if (!entry || entry.hash !== hash(current)) {
      const saved = backup(context, file);
      if (!entry) original = saved;
      log.warn(`${file} ${entry ? "was edited by hand" : "already existed"}; backed up to ${saved} and replaced. Edit Notion instead.`);
    }
  }
  writeAtomic(file, content);
  manifest.files[file] = { hash: hash(content), created: entry?.created ?? true, original };
  log.change(`Wrote ${file}.`);
}

function removeManaged(context, manifest, file, log) {
  const entry = manifest.files[file];
  const stats = lstat(file);
  if (stats) {
    if (!stats.isFile() || hash(fs.readFileSync(file)) !== entry.hash) {
      const saved = backup(context, file, { move: true });
      log.warn(`${file} changed since it was generated; backed up to ${saved}.`);
    } else {
      fs.unlinkSync(file);
    }
    log.change(`Removed ${file}; its project no longer has this Folder in Notion.`);
  }
  restore(entry.original, file, log);
  delete manifest.files[file];
}

function syncProjects(context, manifest, plan, log) {
  const desired = new Map();
  for (const project of plan.projects) {
    desired.set(
      path.join(project.directory, "AGENTS.md"),
      renderProjectAgents({ name: project.name, url: project.url, instructions: project.instructions?.markdown, repos: getRepos(project.directory) }),
    );
    desired.set(
      path.join(project.directory, "notion.json"),
      `${JSON.stringify({ project: project.id, url: project.url, instructions: project.instructions?.id ?? null }, null, 2)}\n`,
    );
  }

  for (const [file, content] of desired) writeManaged(context, manifest, file, content, log);
  for (const file of Object.keys(manifest.files)) {
    const folder = path.relative(context.projects, file).split(path.sep)[0];
    if (!desired.has(file) && !plan.held.has(folder)) removeManaged(context, manifest, file, log);
  }
}

function loadManifest(context) {
  const manifest = readJson(context.manifestPath, {});
  return { version: 1, files: {}, links: {}, units: {}, disabled: [], ...manifest };
}

async function update(context, log, manifest) {
  const config = readJson(path.join(context.repo, "agents.json"), null);
  if (!config?.projects) throw new StopError(`${context.repo}/agents.json is missing the Notion Projects data source.`);
  checkCheckout(context, log);
  syncLinks(context, manifest, log);

  try {
    const plan = await getProjects(context, createNotion(process.env.NOTION_ACCESS_TOKEN), config, log);
    const managedFolders = new Set(Object.keys(manifest.files).map((file) => path.relative(context.projects, file).split(path.sep)[0]));
    if (plan.projects.length === 0 && plan.held.size === 0 && managedFolders.size > 0) {
      throw new Error("Notion returned no projects with a usable Folder");
    }
    syncProjects(context, manifest, plan, log);
  } catch (error) {
    log.error(`Project instructions not updated: ${error.message}. Kept the last good files.`);
  }
}

function getUnits(context) {
  const script = fileURLToPath(import.meta.url);
  return {
    [`${unit}.service`]: [
      "[Unit]",
      "Description=Install agent instructions and skills from Notion (hellogafaro-agents)",
      "Wants=network-online.target",
      "After=network-online.target",
      "",
      "[Service]",
      "Type=oneshot",
      `Environment=HOME=${context.home}`,
      `Environment=PATH=${path.dirname(process.execPath)}:/usr/local/bin:/usr/bin:/bin`,
      `ExecStart=${process.execPath} ${script} update --repo ${context.repo}`,
      "",
    ].join("\n"),
    [`${unit}.timer`]: [
      "[Unit]",
      "Description=Run hellogafaro-agents update four times a day, after the Notion export",
      "",
      "[Timer]",
      "OnCalendar=*-*-* 03,09,15,21:45:00 UTC",
      "Persistent=true",
      "",
      "[Install]",
      "WantedBy=timers.target",
      "",
    ].join("\n"),
  };
}

function install(context, log, manifest) {
  for (const [name, content] of Object.entries(getUnits(context))) {
    const file = path.join(context.units, name);
    if (fs.existsSync(file) && !manifest.units[file] && fs.readFileSync(file, "utf8") !== content) {
      log.warn(`${file} existed; backed up to ${backup(context, file)}.`);
    }
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content) {
      writeAtomic(file, content);
      log.change(`Wrote ${file}.`);
    }
    manifest.units[file] = hash(content);
  }

  if (fs.existsSync(path.join(context.units, legacyTimer)) && systemctl(context, ["is-enabled", legacyTimer]).out !== "disabled") {
    const result = systemctl(context, ["disable", "--now", legacyTimer]);
    if (result.ok) {
      if (!manifest.disabled.includes(legacyTimer)) manifest.disabled.push(legacyTimer);
      log.change(`Disabled ${legacyTimer}; ${unit}.timer replaces it.`);
    } else log.error(`Could not disable ${legacyTimer}: ${result.err}`);
  }

  for (const args of [["daemon-reload"], ["enable", "--now", `${unit}.timer`]]) {
    const result = systemctl(context, args);
    if (!result.ok) throw new StopError(`systemctl --user ${args.join(" ")} failed: ${result.err}`);
  }
  log.info(`Enabled ${unit}.timer.`);
}

function restore(original, file, log) {
  if (!original || !lstat(original) || lstat(file)) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.renameSync(original, file);
  log.change(`Restored ${file} from ${original}.`);
}

function remove(context, log, manifest) {
  const disable = systemctl(context, ["disable", "--now", `${unit}.timer`]);
  if (!disable.ok) log.warn(`systemctl --user disable --now ${unit}.timer: ${disable.err}`);
  for (const [file, digest] of Object.entries(manifest.units)) {
    if (!fs.existsSync(file)) continue;
    if (hash(fs.readFileSync(file)) !== digest) log.warn(`${file} changed since install; backed up to ${backup(context, file)}.`);
    fs.unlinkSync(file);
    log.change(`Removed ${file}.`);
  }
  systemctl(context, ["daemon-reload"]);

  for (const [link, entry] of Object.entries(manifest.links)) {
    if (!entry.created) continue;
    const stats = lstat(link);
    if (!stats?.isSymbolicLink() || readLinkTarget(link) !== entry.target) {
      log.warn(`${link} no longer points to ${entry.target}; left it.`);
      continue;
    }
    fs.unlinkSync(link);
    log.change(`Removed ${link}.`);
    restore(entry.original, link, log);
  }

  for (const [file, entry] of Object.entries(manifest.files)) {
    if (!entry.created || !lstat(file)) continue;
    if (hash(fs.readFileSync(file)) !== entry.hash) {
      log.warn(`${file} was edited after it was generated; left it.`);
      continue;
    }
    fs.unlinkSync(file);
    log.change(`Removed ${file}.`);
    restore(entry.original, file, log);
  }

  if (manifest.disabled.length) log.warn(`Left ${manifest.disabled.join(", ")} disabled; re-enable by hand if still wanted.`);
  fs.rmSync(context.manifestPath, { force: true });
  fs.rmSync(context.lastRunPath, { force: true });
}

function status(context) {
  if (!fs.existsSync(context.manifestPath)) {
    console.log(`Not installed: ${context.manifestPath} does not exist.`);
    return 1;
  }
  const manifest = loadManifest(context);
  const lastRun = readJson(context.lastRunPath, null);
  const lines = [];
  let healthy = true;

  if (lastRun) {
    lines.push(`Last run: ${lastRun.command} ${lastRun.finishedAt} ${lastRun.ok ? "ok" : "FAILED"} (${lastRun.changes.length} changes, ${lastRun.warnings.length} warnings, ${lastRun.errors.length} errors)`);
    for (const message of lastRun.errors) lines.push(`  error: ${message}`);
    for (const message of lastRun.warnings) lines.push(`  warn: ${message}`);
    healthy &&= lastRun.ok;
  } else {
    lines.push("Last run: never");
    healthy = false;
  }

  const enabled = systemctl(context, ["is-enabled", `${unit}.timer`]).out || "unknown";
  const next = systemctl(context, ["show", `${unit}.timer`, "--property=NextElapseUSecRealtime", "--value"]).out;
  lines.push(`Timer: ${unit}.timer ${enabled}${next ? `, next ${next}` : ""}`);

  const head = git(context, ["rev-parse", "--short", "HEAD"]).out;
  const branch = git(context, ["rev-parse", "--abbrev-ref", "HEAD"]).out;
  const dirty = git(context, ["status", "--porcelain"]).out;
  lines.push(`Checkout: ${context.repo} ${branch}@${head}${dirty ? " (local changes)" : ""}`);
  if (dirty) healthy = false;

  const drift = [];
  for (const [file, entry] of Object.entries(manifest.files)) {
    if (!lstat(file)) drift.push(`missing ${file}`);
    else if (hash(fs.readFileSync(file)) !== entry.hash) drift.push(`edited ${file}`);
  }
  for (const [link, entry] of Object.entries(manifest.links)) {
    const stats = lstat(link);
    if (!stats?.isSymbolicLink()) drift.push(`${stats ? "replaced" : "missing"} ${link}`);
    else if (readLinkTarget(link) !== entry.target) drift.push(`retargeted ${link}`);
  }
  const exported = getExport(context);
  for (const name of exported.skills) {
    if (!manifest.links[path.join(context.skills, name)]) drift.push(`not linked ${path.join(context.skills, name)}`);
  }

  lines.push(`Managed: ${Object.keys(manifest.files).length} files, ${Object.keys(manifest.links).length} links, ${Object.keys(manifest.units).length} units`);
  for (const file of Object.keys(manifest.files).sort()) lines.push(`  ${file}`);
  lines.push(`Drift: ${drift.length ? "" : "none"}`);
  for (const item of drift) lines.push(`  ${item}`);
  console.log(lines.join("\n"));
  return healthy && drift.length === 0 ? 0 : 1;
}

function runWithToken(context, argv) {
  if (process.env.NOTION_ACCESS_TOKEN) return null;
  if (process.env.HELLOGAFARO_AGENTS_CHILD) throw new StopError("infisical run did not provide NOTION_ACCESS_TOKEN.");
  const startedAt = new Date().toISOString();
  fs.mkdirSync(context.state, { recursive: true });
  const resultFile = path.join(context.state, `child-${process.pid}`);
  fs.rmSync(resultFile, { force: true });
  const result = spawnSync(
    "infisical",
    [
      "run", "--projectId", infisicalProject, "--env", "prod", "--silent", "--",
      "env", `HOME=${context.home}`, "HELLOGAFARO_AGENTS_CHILD=1", `HELLOGAFARO_AGENTS_RESULT=${resultFile}`,
      process.execPath, fileURLToPath(import.meta.url), ...argv,
    ],
    { stdio: "inherit", env: { ...process.env, HOME: os.userInfo().homedir } },
  );
  const childCode = fs.existsSync(resultFile) ? Number(fs.readFileSync(resultFile, "utf8")) : null;
  fs.rmSync(resultFile, { force: true });
  if (childCode !== null) return Number.isInteger(childCode) ? childCode : 1;

  const message = `Could not read NOTION_ACCESS_TOKEN through infisical run (${result.error?.message ?? `exit ${result.status}`}); nothing changed.`;
  createLog(context).error(message);
  writeJson(context.lastRunPath, { command: argv[0], startedAt, finishedAt: new Date().toISOString(), ok: false, errors: [message], warnings: [], changes: [] });
  return 1;
}

async function main(argv) {
  const { command, flags } = parseArgs(argv);
  if (!["install", "update", "remove", "status"].includes(command)) throw new StopError(usage);
  const context = getContext(flags);
  if (command === "status") return status(context);
  if (command !== "remove") {
    const code = runWithToken(context, argv);
    if (code !== null) return code;
  }

  const lock = acquireLock(context);
  if (lock === null) {
    console.error(`Another ${unit} run holds ${context.lockPath}; exiting.`);
    return exitLocked;
  }

  const log = createLog(context);
  const manifest = loadManifest(context);
  const startedAt = new Date().toISOString();
  log.info(`${command} started (home ${context.home}, checkout ${context.repo}).`);
  try {
    if (command === "install") install(context, log, manifest);
    if (command === "install" || command === "update") await update(context, log, manifest);
    if (command === "remove") remove(context, log, manifest);
  } catch (error) {
    if (!(error instanceof StopError)) throw error;
    log.error(error.message);
  }

  if (command !== "remove") {
    writeJson(context.manifestPath, manifest);
    writeJson(context.lastRunPath, { command, startedAt, finishedAt: new Date().toISOString(), ok: log.entries.errors.length === 0, ...log.entries });
  }
  log.info(`${command} finished: ${log.entries.changes.length} changes, ${log.entries.warnings.length} warnings, ${log.entries.errors.length} errors.`);
  return log.entries.errors.length === 0 ? 0 : 1;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof StopError ? error.message : error.stack);
  process.exitCode = 1;
}
if (process.env.HELLOGAFARO_AGENTS_RESULT) fs.writeFileSync(process.env.HELLOGAFARO_AGENTS_RESULT, String(process.exitCode));
