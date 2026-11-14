---
name: |-
  automations
description: |-
  Creates, changes, pauses, and explains scheduled agent automations in the Notion Automations database, including when each one runs. Use when work must run on a schedule or once at a set time, not for work done now.
notion_page_id: 418fc798-2e43-8148-b975-d43aba7652dd
disable-model-invocation: true
---

# automations

An automation is a row in the Notion Automations database: a prompt an agent runs on a schedule. Keep every definition in Notion, never in the generated files. Notion Code (`ntncode`) syncs each enabled row it accepts into an automation file, and its scheduler, `ntncode serve`, starts a fresh agent session for every run. `ntncode help` describes every command; each prints one JSON document.

## Source

| Source | ID |
| --- | --- |
| Automations database | `418fc7982e4380cba396d92234d48e8e` |
| Automations data source | `418fc798-2e43-8068-ab40-000bd165eab6` |
| Runs data source, in the same database | `418fc798-2e43-80bc-8108-000bf0665e33` |

Fetch the data source's current schema before writing. If an ID fails, find the database by its title, Automations.

Each run is a row in Runs with its own `RUN-` ID, linked to its automation through Automation and listed in the automation's Runs. The runner creates and updates it, never the agent. Its Title is the automation's ID and the run's time, such as `AUT-12@2026-11-20T08:00Z`, which stops a scheduled time from running twice. It also has Trigger (`Scheduled` or `Manual`), Status (`In progress`, `Completed`, or `Failed`), Date from start to finish, and a page body that starts with the agent, model, and effort that ran and the command that opens the session, then the agent's final reply as the run's report. Read runs to check results; never create or edit them.

## Fields

| Property | Holds |
| --- | --- |
| ID | `AUT-` and a number, set by Notion. Use it to refer to an automation in replies, prompts, and runs |
| Title | The client or area, then what it does, such as `Jackfir publish Black Friday theme`. Keep task IDs, dates, and links in the prompt |
| Project | The Projects row it works for; the agent runs in its folder. Empty means no project, for work on no codebase such as a digest or a reminder |
| Assignee | The one person it runs for; set it to the person who asked. Each installation runs only the automations assigned to its user, so an empty Assignee never runs |
| Status | `Disabled` or `Enabled`. Anything but `Enabled` never runs |
| Agent | `Claude Code`, `Codex`, or `OpenCode` |
| Model | Optional; empty uses the agent's default. Pick a model such as `Opus 5.5` or `GPT-6.1 Sol`; Notion Code turns it into the agent's model ID (`claude-opus-5-5`, `gpt-6.1-sol`). For a new model, add an option named the same way |
| Effort | Optional: `Low`, `Medium`, `High`, `Xhigh`, or `Max`; empty uses the agent's default. Codex's highest is `Xhigh`, so `Max` runs as `Xhigh`. OpenCode needs a Model to set it |
| Schedule properties | When it runs: Start, Time zone, Repeat, and the rest. Read [schedules](references/schedules.md) before setting them |
| Page body | The prompt, written as the next section says |

## Write the prompt

The page body holds only what the run must do. Each run already gets the title, when it was scheduled and started (`<trigger>`), the project folder, the organization's and project's instructions (including the bot's name), the run instructions for automations, and the reports of the automation's three latest runs (`<previous-runs>`). Never repeat those in the body, and leave out background a run doesn't act on.

Use this structure, with no other headings:

1. One or two opening sentences: what the run achieves, its Notion task, and any approval with who gave it and when. A limit that governs the whole run, such as "Read-only: never write to Shopify", follows as one short line.
2. `## Steps`, numbered, in order. Checks that must pass before acting come first, with what to do when one fails: change nothing and report why. Give the exact commands, IDs, URLs, files, and accounts, and put the data a step checks against inside that step.
3. `## Report`: where the result goes, its exact wording, and what to do when there's nothing to report.

Make every run safe to repeat. A run can be retried or start late after downtime, so each step checks the current state before changing anything and skips what's already done. When timing matters, say what to do when `started_at` is well after `scheduled_for`.

Every run is a new session. It can use `<previous-runs>` to avoid repeating a report or a comment, never memory of an earlier session. Keep any other state a run needs in a file under `~/.local/state/automations/<automation>/`, never in `/tmp`. To get a person's attention during a run, use `ntncode alert "<message>"`; a failed run alerts by itself.

Runs only read secrets and can't ask for new ones. When a step needs a secret, check it exists in Infisical before creating the automation, ask the person for any that are missing, and name the Infisical project ID and environment in the prompt, so each run uses `infisical run --projectId <id> --env <env> -- <command>`.

## Steps

1. Search the database before creating a row. Update the row that already owns the same work instead of adding a second one.
2. Write the prompt as above.
3. Set the schedule properties following [schedules](references/schedules.md), and state the next three run times in your reply so the person can check them.
4. Create a new row as `Disabled`, and leave Status as it is when you change a row. Only the assignee sets `Enabled`. The sync accepts an automation only when its assignee made the last edit, and otherwise keeps the previous version, so an agent's own edit never runs. Setting `Disabled` always takes effect, whoever does it.
5. Rehearse it, as the next section says, before the person enables it.
6. To pause an automation, set Status to `Disabled`. Don't delete a row; its history stays with it.
7. After a write, fetch the row again and confirm every property and the body persisted.
8. After the assignee enables it, run `ntncode status` and confirm its next three runs; `ntncode doctor` names any row that won't run and why.

Ask one focused question when the project, the agent, or the time zone is unclear. Never guess a schedule from a vague request such as "regularly".

A run started by an automation never creates or changes automations.

## Rehearse before enabling

For an automation that changes anything, add a line to its prompt such as `This run is a rehearsal. Do everything except <the changes>, and report what you would have done.` While the row is still `Disabled`, start one run by hand with `ntncode run AUT-<n> --wait`; it reads the row fresh from Notion and returns the run's ID, status, and report as JSON. The run uses the automation's own project, agent, model, and secrets, so it meets the same blockers a real run would. Read its result in the automation's Runs, fix what failed, and repeat until a run is clean. Then remove the rehearsal line.

For a read-only automation, such as a digest, a report, or a reminder, one manual run is the test.

It is ready when every step passed in rehearsal, and each step that can't be rehearsed, such as publishing, sending, or paying, checks its preconditions at run time. Tell the person which steps passed, which weren't rehearsed and why, and that it is ready for them to enable. After the first real run, read its row in Runs.
