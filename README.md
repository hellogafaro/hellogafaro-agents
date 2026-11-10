# Hello Gafaro agents

Generated mirror of everything Hello Gafaro's agents load: the Notion Skills
library and the global agent instructions, plus the server CLI that installs
them, with each project's instructions, for every agent on g4f4r0-server.

Notion is the source of truth. Do not edit generated content in this repository
or on the server; edit Notion and let the sync carry it.

## Layout

- `agents.json` holds only Notion IDs: the global "Agent instructions" page,
  the Skills data source and the Projects data source.
- `skills/` holds the complete Notion skill exports, including supporting files.
  Each `notion_page_id` identifies the canonical Notion page.
- `instructions/AGENTS.md` is the global "Agent instructions" page.
- `scripts/sync-notion-skills.mjs` is the exporter the GitHub Action runs.
- `scripts/agents.mjs` is the server CLI.
- `tests/` validates the export, the rendering and the CLI edge cases.
- `AGENTS.md` at the root is this repository's own development guide.

The repository is public, so only public-safe content is committed. Project
instructions and `notion.json` files are written on the server only.

## Notion

- Skills: a page in the Skills database. Untick `Auto-invoke` to keep a very
  specific skill installed but out of the model's automatic list; the exporter
  then adds `disable-model-invocation: true` to its `SKILL.md`.
- Global instructions: the "Agent instructions" page in Documents
  (`agents.json` → `instructions`).
- Project instructions: set the project's `Folder` property to its folder under
  `~/projects`, and add an "Agent instructions" child page to the project page.

## Export (GitHub Action)

The `Sync Notion skills` workflow runs at 03:17, 09:17, 15:17 and 21:17 UTC and
on demand. It signs in to EU Infisical with GitHub OIDC through the
`github-hellogafaro-skills-sync` machine identity, reads only
`NOTION_ACCESS_TOKEN` from the root of the `hellogafaro-studio` project
(`prod`), exports every skill and the global page, validates them with
`npm run check`, and commits only real changes. An empty or broken export fails
the run and commits nothing.

The machine identity only accepts OIDC tokens from this repository's `main`
branch and the `Sync Notion skills` workflow, so no Infisical secret is stored in
GitHub. The workflow needs the repository variable `INFISICAL_IDENTITY_ID`.

Run it now:

```bash
gh workflow run "Sync Notion skills" --repo hellogafaro/hellogafaro-skills
```

## Server

The CLI runs from this checkout on g4f4r0-server. All paths derive from `HOME`
(or `--home`); `--repo` and `--systemctl` override the checkout and the
`systemctl` binary, so it can run against a sandbox.

```bash
node scripts/agents.mjs install   # timer + first update
node scripts/agents.mjs update    # sync now
node scripts/agents.mjs status    # last run, managed files, drift
node scripts/agents.mjs remove    # undo what install and update created
```

`update` takes a lock, then:

1. Stops if the checkout has local changes or commits; it never resets. Otherwise
   `git pull --ff-only`.
2. Links `~/.agents/AGENTS.md` to `instructions/AGENTS.md` and every exported
   skill into `~/.agents/skills`, and prunes links into the checkout whose target
   is gone. Other entries in `~/.agents/skills` are left alone.
3. Reads the Projects data source and, for each project whose `Folder` exists
   under `~/projects`, writes `~/projects/<folder>/AGENTS.md` (Notion link,
   repository table from each subfolder's git remote and default branch, and the
   "Agent instructions" page) and `~/projects/<folder>/notion.json` (`project`,
   `url`, `instructions`). Files of projects that left Notion or lost their
   `Folder` are removed.

The Notion token comes from `infisical run --projectId
88269636-bd9f-447a-a1fd-b788edc4895e --env prod` and is never printed.

Safety rules:

- Every Notion read finishes before any project file is written. If Notion is
  down or rate-limited past its retries, the last good files stay, the run logs
  the error and exits non-zero.
- A duplicate `Folder` skips that folder and keeps its files; an empty or invalid
  `Folder`, a missing folder or a missing instructions page is logged and skipped.
- A real file or folder where a link belongs, and a hand edit to a generated
  file, is backed up under `~/.local/state/hellogafaro-agents/backups/` before it
  is replaced, with a warning.
- Writes and links are atomic (temporary file, then rename). A run with no
  changes touches no managed file, link or manifest; only the log and
  `last-run.json` record it.

`install` writes `hellogafaro-agents.service` and `hellogafaro-agents.timer`
(03:45, 09:45, 15:45 and 21:45 UTC, `Persistent=true`) to
`~/.config/systemd/user`, disables `skills-sync.timer` when it is installed,
enables the timer and runs one update.

`remove` disables the timer and deletes only what its manifest
(`~/.local/state/hellogafaro-agents/manifest.json`) says it created, restoring
any file it displaced. Edited files, unmanaged entries, backups and the log stay.
It leaves `skills-sync.timer` disabled.

Logs: `~/.local/state/hellogafaro-agents/update.log` and
`journalctl --user -u hellogafaro-agents`.

## Rules

- Change a skill or instructions in Notion, then refresh the snapshot.
- Never sync edits from GitHub or the server back into Notion.
- Keep lowercase hyphen skill IDs and trigger-first descriptions.
- Do not add removed legacy skills.
