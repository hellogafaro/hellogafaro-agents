import assert from "node:assert/strict";
import { execFile, execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { after, before, beforeEach, test } from "node:test";

const cli = path.resolve(import.meta.dirname, "../scripts/agents.mjs");
const gitEnv = { GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1", GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@t", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@t" };
const ids = { alpha: "aaaaaaaa-0000-0000-0000-000000000001", beta: "bbbbbbbb-0000-0000-0000-000000000002", alphaDoc: "aaaaaaaa-0000-0000-0000-0000000000d1" };

let server;
let notion;
let root;
let sandbox;

function git(directory, ...args) {
  return execFileSync("git", ["-C", directory, ...args], { env: { ...process.env, ...gitEnv }, encoding: "utf8" }).trim();
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function project(name, folder, id = ids[name.toLowerCase()]) {
  return { id, url: `https://app.notion.com/p/${name}-${id.replaceAll("-", "")}`, properties: { Name: { type: "title", title: [{ plain_text: name }] }, Folder: { type: "rich_text", rich_text: [{ plain_text: folder }] } } };
}

function resetNotion() {
  notion = {
    projects: [project("Alpha", "alpha"), project("Beta", "beta")],
    children: { [ids.alpha]: [{ type: "child_page", id: ids.alphaDoc, child_page: { title: "Agent instructions" } }] },
    markdown: { [ids.alphaDoc]: '1. Use <code>alpha-studio</code>.\n<empty-block/>\n\n<callout icon="⚠️" color="red_bg">\nNever deploy on Fridays.\n</callout>\n2. Keep it short.' },
    failures: [],
    requests: 0,
  };
}

function seedCommit(files, message) {
  for (const [file, content] of Object.entries(files)) {
    if (content === null) fs.rmSync(path.join(sandbox.seed, file), { recursive: true, force: true });
    else write(path.join(sandbox.seed, file), content);
  }
  git(sandbox.seed, "add", "-A");
  git(sandbox.seed, "commit", "-q", "-m", message);
  git(sandbox.seed, "push", "-q", "origin", "main");
}

function skill(name) {
  return `---\nname: ${name}\ndescription: Use for ${name}.\nnotion_page_id: 11111111-2222-3333-4444-555555555555\n---\n\n# ${name}\n`;
}

function makeSandbox() {
  const base = fs.mkdtempSync(path.join(root, "case-"));
  const home = path.join(base, "home");
  const seed = path.join(base, "seed");
  const origin = path.join(base, "origin.git");
  const repo = path.join(home, "projects/operations/agents");
  fs.mkdirSync(seed, { recursive: true });
  git(seed, "init", "-q", "-b", "main");
  for (const [file, content] of Object.entries({
    "agents.json": JSON.stringify({ instructions: ids.alphaDoc, skills: ids.alphaDoc, projects: ids.alphaDoc }),
    "instructions/AGENTS.md": "# Organization instructions\n\nBe careful.\n",
    "skills/analyze/SKILL.md": skill("analyze"),
    "skills/write/SKILL.md": skill("write"),
  })) {
    write(path.join(seed, file), content);
  }
  git(seed, "add", "-A");
  git(seed, "commit", "-q", "-m", "seed");
  execFileSync("git", ["clone", "-q", "--bare", seed, origin], { env: { ...process.env, ...gitEnv } });
  git(seed, "remote", "add", "origin", origin);
  git(seed, "fetch", "-q", "origin");
  git(seed, "branch", "-q", "--set-upstream-to=origin/main");
  fs.mkdirSync(path.dirname(repo), { recursive: true });
  execFileSync("git", ["clone", "-q", origin, repo], { env: { ...process.env, ...gitEnv } });

  const theme = path.join(home, "projects/alpha/alpha-theme");
  fs.mkdirSync(theme, { recursive: true });
  git(theme, "init", "-q");
  git(theme, "commit", "-q", "--allow-empty", "-m", "init");
  git(theme, "remote", "add", "origin", "https://github.com/acme/alpha-theme.git");
  git(theme, "update-ref", "refs/remotes/origin/main", "HEAD");
  git(theme, "symbolic-ref", "refs/remotes/origin/HEAD", "refs/remotes/origin/main");
  fs.mkdirSync(path.join(home, "projects/beta"), { recursive: true });

  const stub = path.join(base, "systemctl");
  const calls = path.join(base, "systemctl.log");
  write(stub, `#!/bin/sh\necho "$*" >> "${calls}"\nexit 0\n`);
  fs.chmodSync(stub, 0o755);
  return { base, home, seed, repo, stub, calls, state: path.join(home, ".local/state/hellogafaro-agents") };
}

function run(...args) {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [cli, ...args, "--home", sandbox.home, "--repo", sandbox.repo, "--systemctl", sandbox.stub],
      { env: { ...process.env, ...gitEnv, HOME: sandbox.home, NOTION_ACCESS_TOKEN: "test-token", NOTION_API_URL: `http://127.0.0.1:${server.address().port}` } },
      (error, stdout, stderr) => resolve({ code: error ? error.code : 0, stdout, stderr, output: stdout + stderr }),
    );
  });
}

function snapshot() {
  const entries = {};
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.name === ".git" || file.startsWith(path.join(sandbox.state, "update.log")) || file === path.join(sandbox.state, "last-run.json")) continue;
      const stats = fs.lstatSync(file);
      if (stats.isSymbolicLink()) entries[file] = `-> ${fs.readlinkSync(file)}`;
      else if (stats.isDirectory()) walk(file);
      else entries[file] = `${stats.mtimeMs} ${read(file)}`;
    }
  };
  walk(sandbox.home);
  return entries;
}

before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-cli-"));
  server = http.createServer((request, response) => {
    notion.requests += 1;
    const send = (status, body, headers = {}) => {
      response.writeHead(status, { "Content-Type": "application/json", ...headers });
      response.end(JSON.stringify(body));
    };
    const failure = notion.failures.shift();
    if (failure) return send(failure, { message: "unavailable" }, { "Retry-After": "0.01" });
    const url = new URL(request.url, "http://localhost");
    let match;
    if ((match = url.pathname.match(/^\/data_sources\/[^/]+\/query$/u))) return send(200, { results: notion.projects, has_more: false });
    if ((match = url.pathname.match(/^\/blocks\/([^/]+)\/children$/u))) return send(200, { results: notion.children[match[1]] ?? [], has_more: false });
    if ((match = url.pathname.match(/^\/pages\/([^/]+)\/markdown$/u))) {
      return notion.markdown[match[1]] === undefined ? send(404, { message: "not found" }) : send(200, { markdown: notion.markdown[match[1]], truncated: false, unknown_block_ids: [] });
    }
    return send(404, { message: "unknown route" });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
});

after(() => {
  server.close();
  fs.rmSync(root, { recursive: true, force: true });
});

beforeEach(() => {
  resetNotion();
  sandbox = makeSandbox();
});

test("update renders projects, links instructions and skills, and a second run changes nothing", async () => {
  const first = await run("update");
  assert.equal(first.code, 0, first.output);

  const agents = read(path.join(sandbox.home, "projects/alpha/AGENTS.md"));
  assert.match(agents, /^# Alpha\n/u);
  assert.match(agents, /Notion project: https:\/\/app\.notion\.com\/p\/Alpha-aaaaaaaa000000000000000000000001\./u);
  assert.match(agents, /\| `alpha-theme\/` \| \[acme\/alpha-theme\]\(https:\/\/github\.com\/acme\/alpha-theme\) \| `main` \| none \|/u);
  assert.match(agents, /## Instructions\n\n1\. Use `alpha-studio`\.\n\n> ⚠️ Never deploy on Fridays\.\n\n2\. Keep it short\.\n$/u);
  assert.doesNotMatch(agents, /empty-block|callout|<code>/u);
  assert.deepEqual(JSON.parse(read(path.join(sandbox.home, "projects/alpha/notion.json"))), {
    project: ids.alpha,
    url: "https://app.notion.com/p/Alpha-aaaaaaaa000000000000000000000001",
    instructions: ids.alphaDoc,
  });
  assert.equal(fs.readlinkSync(path.join(sandbox.home, ".agents/AGENTS.md")), path.join(sandbox.repo, "instructions/AGENTS.md"));
  assert.equal(fs.readlinkSync(path.join(sandbox.home, ".agents/skills/write")), path.join(sandbox.repo, "skills/write"));

  const before = snapshot();
  const second = await run("update");
  assert.equal(second.code, 0, second.output);
  assert.match(second.output, /update finished: 0 changes, 1 warnings, 0 errors/u);
  assert.deepEqual(snapshot(), before);
  assert.equal(Object.keys(before).filter((file) => file.includes(".tmp-")).length, 0);
});

test("Notion outage keeps the last good files and exits non-zero", async () => {
  assert.equal((await run("update")).code, 0);
  const before = read(path.join(sandbox.home, "projects/alpha/AGENTS.md"));
  notion.markdown[ids.alphaDoc] = "Changed";
  notion.failures = Array(20).fill(503);

  const result = await run("update");
  assert.equal(result.code, 1);
  assert.match(result.output, /Project instructions not updated: Notion .* failed \(503\).*Kept the last good files/u);
  assert.equal(read(path.join(sandbox.home, "projects/alpha/AGENTS.md")), before);
  assert.equal(JSON.parse(read(path.join(sandbox.state, "last-run.json"))).ok, false);
  assert.match(read(path.join(sandbox.state, "update.log")), /error Project instructions not updated/u);
});

test("rate limits are retried", async () => {
  notion.failures = [429, 429];
  const result = await run("update");
  assert.equal(result.code, 0, result.output);
  assert.ok(fs.existsSync(path.join(sandbox.home, "projects/alpha/AGENTS.md")));
});

test("a second concurrent run exits without touching anything", async () => {
  fs.mkdirSync(sandbox.state, { recursive: true });
  const holder = spawn("flock", [path.join(sandbox.state, "lock"), "-c", "sleep 3"]);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const result = await run("update");
  holder.kill();
  assert.equal(result.code, 75);
  assert.match(result.output, /Another hellogafaro-agents run holds/u);
  assert.equal(fs.existsSync(path.join(sandbox.home, "projects/alpha/AGENTS.md")), false);
});

test("a dirty checkout stops the update and is left as is", async () => {
  write(path.join(sandbox.repo, "skills/write/SKILL.md"), "local edit");
  const result = await run("update");
  assert.equal(result.code, 1);
  assert.match(result.output, /has local changes; not updating/u);
  assert.equal(read(path.join(sandbox.repo, "skills/write/SKILL.md")), "local edit");
  assert.equal(fs.existsSync(path.join(sandbox.home, ".agents/skills/write")), false);
});

test("a diverged checkout stops the update and is never reset", async () => {
  seedCommit({ "skills/new/SKILL.md": skill("new") }, "upstream");
  write(path.join(sandbox.repo, "local.txt"), "x");
  git(sandbox.repo, "add", "-A");
  git(sandbox.repo, "commit", "-q", "-m", "local");
  const head = git(sandbox.repo, "rev-parse", "HEAD");

  const result = await run("update");
  assert.equal(result.code, 1);
  assert.match(result.output, /1 local commit\(s\) not on origin\/main; not updating/u);
  assert.equal(git(sandbox.repo, "rev-parse", "HEAD"), head);
});

test("pulls new exports, links added skills and prunes deleted ones", async () => {
  assert.equal((await run("update")).code, 0);
  seedCommit({ "skills/new/SKILL.md": skill("new"), "skills/analyze": null }, "upstream");

  const result = await run("update");
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /Pulled /u);
  assert.equal(fs.readlinkSync(path.join(sandbox.home, ".agents/skills/new")), path.join(sandbox.repo, "skills/new"));
  assert.equal(fs.existsSync(path.join(sandbox.home, ".agents/skills/analyze")), false);
  assert.equal(fs.lstatSync(path.join(sandbox.home, ".agents/skills/write")).isSymbolicLink(), true);
});

test("handles missing folders, duplicate, empty and invalid Folder values", async () => {
  assert.equal((await run("update")).code, 0);
  const beta = read(path.join(sandbox.home, "projects/beta/AGENTS.md"));
  notion.projects = [
    project("Alpha", "alpha"),
    project("Beta", "beta"),
    project("Beta copy", "beta", "cccccccc-0000-0000-0000-000000000003"),
    project("Gamma", "gamma", "dddddddd-0000-0000-0000-000000000004"),
    project("Blank", "   ", "eeeeeeee-0000-0000-0000-000000000005"),
    project("Escape", "../etc", "ffffffff-0000-0000-0000-000000000006"),
  ];

  const result = await run("update");
  assert.equal(result.code, 1);
  assert.match(result.output, /Folder "beta" is set on 2 Notion projects \(Beta, Beta copy\); skipped and kept its files/u);
  assert.match(result.output, /"Gamma" points to .*projects\/gamma, which does not exist; skipped/u);
  assert.match(result.output, /"Escape" has an invalid Folder "\.\.\/etc"; skipped/u);
  assert.equal(read(path.join(sandbox.home, "projects/beta/AGENTS.md")), beta);
  assert.equal(fs.existsSync(path.join(sandbox.home, "projects/gamma")), false);
});

test("a project without an instructions page still gets its files", async () => {
  const result = await run("update");
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /"Beta" has no "Agent instructions" page/u);
  assert.match(read(path.join(sandbox.home, "projects/beta/AGENTS.md")), /This project has no "Agent instructions" page in Notion yet\./u);
  assert.equal(JSON.parse(read(path.join(sandbox.home, "projects/beta/notion.json"))).instructions, null);
});

test("removes managed files when a project leaves Notion or its Folder is cleared", async () => {
  assert.equal((await run("update")).code, 0);
  write(path.join(sandbox.home, "projects/beta/notes.md"), "mine");
  notion.projects = [project("Alpha", "alpha")];

  const result = await run("update");
  assert.equal(result.code, 0, result.output);
  assert.equal(fs.existsSync(path.join(sandbox.home, "projects/beta/AGENTS.md")), false);
  assert.equal(fs.existsSync(path.join(sandbox.home, "projects/beta/notion.json")), false);
  assert.equal(read(path.join(sandbox.home, "projects/beta/notes.md")), "mine");
  assert.ok(fs.existsSync(path.join(sandbox.home, "projects/alpha/AGENTS.md")));

  notion.projects = [];
  const empty = await run("update");
  assert.equal(empty.code, 1);
  assert.match(empty.output, /no projects with a usable Folder/u);
  assert.ok(fs.existsSync(path.join(sandbox.home, "projects/alpha/AGENTS.md")));
});

test("backs up real files and folders where links belong, then links", async () => {
  write(path.join(sandbox.home, ".agents/AGENTS.md"), "hand-made instructions");
  write(path.join(sandbox.home, ".agents/skills/write/SKILL.md"), "old copy");

  const result = await run("update");
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /\.agents\/AGENTS\.md was a real file; backed up to/u);
  assert.equal(fs.readlinkSync(path.join(sandbox.home, ".agents/AGENTS.md")), path.join(sandbox.repo, "instructions/AGENTS.md"));
  assert.equal(fs.readlinkSync(path.join(sandbox.home, ".agents/skills/write")), path.join(sandbox.repo, "skills/write"));
  const backups = path.join(sandbox.state, "backups");
  const [stamp] = fs.readdirSync(backups);
  assert.equal(read(path.join(backups, stamp, ".agents/AGENTS.md")), "hand-made instructions");
  assert.equal(read(path.join(backups, stamp, ".agents/skills/write/SKILL.md")), "old copy");
});

test("backs up a hand edit to a generated file, overwrites it and warns", async () => {
  assert.equal((await run("update")).code, 0);
  const file = path.join(sandbox.home, "projects/alpha/AGENTS.md");
  const generated = read(file);
  fs.appendFileSync(file, "\nlocal note\n");

  const result = await run("update");
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /projects\/alpha\/AGENTS\.md was edited by hand; backed up to/u);
  assert.equal(read(file), generated);
  const [stamp] = fs.readdirSync(path.join(sandbox.state, "backups"));
  assert.match(read(path.join(sandbox.state, "backups", stamp, "projects/alpha/AGENTS.md")), /local note/u);
});

test("leaves unmanaged entries in ~/.agents/skills alone, through update and remove", async () => {
  write(path.join(sandbox.home, ".agents/skills/custom/SKILL.md"), "mine");
  fs.symlinkSync("/nonexistent/elsewhere", path.join(sandbox.home, ".agents/skills/foreign"));

  assert.equal((await run("update")).code, 0);
  assert.equal((await run("remove")).code, 0);
  assert.equal(read(path.join(sandbox.home, ".agents/skills/custom/SKILL.md")), "mine");
  assert.equal(fs.readlinkSync(path.join(sandbox.home, ".agents/skills/foreign")), "/nonexistent/elsewhere");
});

test("install sets up the timer and remove takes out only what it created", async () => {
  write(path.join(sandbox.home, ".agents/AGENTS.md"), "original instructions");
  write(path.join(sandbox.home, "projects/alpha/AGENTS.md"), "original project file");
  write(path.join(sandbox.home, ".config/systemd/user/skills-sync.timer"), "[Timer]\n");
  fs.mkdirSync(path.join(sandbox.home, ".agents/skills"), { recursive: true });
  fs.symlinkSync(path.join(sandbox.repo, "skills/analyze"), path.join(sandbox.home, ".agents/skills/analyze"));

  const install = await run("install");
  assert.equal(install.code, 0, install.output);
  const timer = read(path.join(sandbox.home, ".config/systemd/user/hellogafaro-agents.timer"));
  assert.match(timer, /OnCalendar=\*-\*-\* 03,09,15,21:45:00 UTC/u);
  assert.match(timer, /Persistent=true/u);
  const service = read(path.join(sandbox.home, ".config/systemd/user/hellogafaro-agents.service"));
  assert.match(service, new RegExp(`Environment=HOME=${sandbox.home}`, "u"));
  assert.match(service, /ExecStart=.*agents\.mjs update --repo /u);
  assert.match(read(sandbox.calls), /--user disable --now skills-sync\.timer\n--user daemon-reload\n--user enable --now hellogafaro-agents\.timer/u);
  assert.ok(fs.existsSync(path.join(sandbox.home, "projects/alpha/notion.json")));

  const status = execFileSync(process.execPath, [cli, "status", "--home", sandbox.home, "--repo", sandbox.repo, "--systemctl", sandbox.stub], { encoding: "utf8" });
  assert.match(status, /Last run: install .* ok/u);
  assert.match(status, /Drift: none/u);

  const remove = await run("remove");
  assert.equal(remove.code, 0, remove.output);
  assert.match(read(sandbox.calls), /--user disable --now hellogafaro-agents\.timer/u);
  assert.equal(fs.existsSync(path.join(sandbox.home, ".config/systemd/user/hellogafaro-agents.timer")), false);
  assert.equal(read(path.join(sandbox.home, ".agents/AGENTS.md")), "original instructions");
  assert.equal(read(path.join(sandbox.home, "projects/alpha/AGENTS.md")), "original project file");
  assert.equal(fs.existsSync(path.join(sandbox.home, "projects/alpha/notion.json")), false);
  assert.equal(fs.existsSync(path.join(sandbox.home, ".agents/skills/write")), false);
  assert.equal(fs.readlinkSync(path.join(sandbox.home, ".agents/skills/analyze")), path.join(sandbox.repo, "skills/analyze"));
  assert.ok(fs.existsSync(path.join(sandbox.home, ".config/systemd/user/skills-sync.timer")));
  assert.equal(fs.existsSync(path.join(sandbox.state, "manifest.json")), false);
});

test("status reports drift", async () => {
  assert.equal((await run("update")).code, 0);
  fs.appendFileSync(path.join(sandbox.home, "projects/alpha/AGENTS.md"), "edit");
  fs.unlinkSync(path.join(sandbox.home, ".agents/skills/write"));
  const result = await new Promise((resolve) =>
    execFile(process.execPath, [cli, "status", "--home", sandbox.home, "--repo", sandbox.repo, "--systemctl", sandbox.stub], (error, stdout) => resolve({ code: error?.code ?? 0, stdout })),
  );
  assert.equal(result.code, 1);
  assert.match(result.stdout, /edited .*projects\/alpha\/AGENTS\.md/u);
  assert.match(result.stdout, /missing .*\.agents\/skills\/write/u);
});
