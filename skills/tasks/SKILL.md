---
name: |-
  tasks
description: |-
  Triages and maintains Notion tasks, workload, dependencies, and actual Timesheets. Use for accepted work records and completion, not tentative ideas or automatic human-facing comments.
notion_page_id: 3dffc798-2e43-81a1-a8a0-da8a2bb83323
---

# tasks

Notion is the task system; never route this work through Linear, ClickUp, or another task system. Meetings and Documents are read-only sources for task context and time attribution. This skill never schedules or manages meetings and never creates or manages documents.

## Sources

| Source | Purpose | ID |
| --- | --- | --- |
| Tasks | Work records and status | `25ffc7982e4380c58df6fef037530baa` |
| Projects | Project context and workload commitments | `25ffc7982e438086a264e63214fd1a60` |
| Timesheets | Actual task and non-task time | `f2cc8e0db76a4e84a58d30df91bca65c` |
| Meetings | Read-only task and time context | `25ffc7982e438056969fff6a4672eaaa` |
| Documents | Read-only task context | `25ffc7982e438074aa69ecc16e69ada9` |

These database IDs are discovery entry points. In each run, fetch a source's current database and data-source schema before querying or writing it, then use the connector's current queryable ID. If an ID fails, rediscover the source by title. Never guess or store view IDs, page IDs, user IDs, property names, relation targets, templates, or options.

## Hard rules

- Post task comments directly, without Johan's approval, following the comment rules here. Every client update or small progress step gets a short comment with only what changed: what was sent, the options, what's open, who we're waiting on, the email thread link, and attached files such as designs or screenshots. Log the time the same day. Prefer several small comments over one dense one.
- Search before creating. Update the existing record when it owns the same work, even when thin or stale.
- Never assume project, people, dates, duration, status, or relations. Ask one focused question when a missing fact could change the result.
- Write task bodies as two or three short paragraphs, then useful context bullets in ordinary sentences. No headings, Done when lists, acceptance checklists, generic steps, speculative requirements, or repeated properties. A full task means complete necessary fields and sufficient concise context.
- Describe the client team's or project's accepted request as work to do. Individual owners go in Owner and Assignee, never as personal attribution or conversation history in prose.
- Every task needs a Due date, whatever its status, including backlog and Done. Never create, update, or close a task without one, and fill an empty Due date whenever you touch a task. For open work with no given date, ask one focused question; for completed work, use the actual completion date.
- Priority is mandatory for an active task. Preserve explicit priority, use clear urgency and deadline context for routine judgment, and never silently clear it. If priority stays materially ambiguous, ask a focused question before declaring the task prepared.
- Each part of a task has one job. The body holds the request, its context, and what the work needs, never results, progress, or completion state. Assets hold only inputs needed to do the work, such as briefs, client files, and reference images, never outputs. Comments hold progress and results. The completion comment carries the final deliverable and the result files a reviewer or another agent needs to judge or reproduce it, posted and confirmed before the task is marked Done. Code, scripts, and raw data stay in their repository or inside an evidence archive, even when a result cites them. Comments are never just source history or asset storage; the one narrow exception is a specialist's concise verified-match comment for an explicitly requested cross-system sync. Details, file limits, and the upload route: [journal-and-artifacts.md](references/journal-and-artifacts.md).
- Keep each comment as short as `write` allows: a bold first line with the result, then a few short paragraphs. Notion comments render bold, italic, inline code, links, and paragraph breaks, but not lists or headings, so never use those in a comment.
- After a write, fetch the affected page and confirm the change persisted.
- Search, read, create, and update pages with the `notion` MCP server. Query databases with Executor's `tools.notion.api.dataSources.postDatabaseQuery`, because Notion's own query tool has a monthly allowance on this plan. Post comments with `tools.notion.api.comments.createAComment` and `display_name` set to `{ type: "custom", custom: { name } }`, which Notion's own comment tool can't set. Find tools by what they do.
- On every task you create or update, set the Done by people property to the person the Notion connection acts for. Sign every comment with a custom display name holding only your agent name.
- Record only the actual duration and date in Timesheets. Ask when either is missing; never infer it. Never set a billable flag, and never record or report a time of day.

## Workflow

For intake or decomposition, first follow [triage and slicing](references/triage-and-slicing.md). For completed work, `deliver` owns the cross-system handover; this skill owns Notion records and actual time.

1. Resolve the live schema, Owner, and Assignee, then find, create, or update the task: [records-and-tasks.md](references/records-and-tasks.md).
2. Before assigning or planning, inspect the Project and the Assignee's load: [workload.md](references/workload.md).
3. Keep the task body, comments, and attachments current: [journal-and-artifacts.md](references/journal-and-artifacts.md).
4. Log time, mark Done, and report: [time-and-completion.md](references/time-and-completion.md).

Finish when the correct Notion records match the request, no duplicate exists, every touched task has a Due date, required relations are set, authorized status changes persisted, time is in Timesheets, and every Done task passed the completion check in [time-and-completion.md](references/time-and-completion.md).
