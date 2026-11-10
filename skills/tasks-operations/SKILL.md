---
name: |-
  tasks-operations
description: |-
  Triages and maintains Notion tasks, workload, dependencies, and actual Timesheets. Use for accepted work records and completion, not tentative ideas or automatic human-facing comments.
notion_page_id: 3dffc798-2e43-81a1-a8a0-da8a2bb83323
---

# tasks-operations

Notion is the task system. Do not route this work through Linear, ClickUp, or another task system. Meetings and Documents are read-only sources for task context and time attribution. Never schedule or manage meetings or create or manage documents through this skill.

## Sources

| Source | Purpose | ID |
| --- | --- | --- |
| Tasks | Work records and status | `25ffc7982e4380c58df6fef037530baa` |
| Projects | Project context and workload commitments | `25ffc7982e438086a264e63214fd1a60` |
| Timesheets | Actual task and non-task time | `f2cc8e0db76a4e84a58d30df91bca65c` |
| Meetings | Read-only task and time context | `25ffc7982e438056969fff6a4672eaaa` |
| Documents | Read-only task context | `25ffc7982e438074aa69ecc16e69ada9` |

Use these database IDs as discovery entry points. Fetch a source's current database and data-source schema before querying or writing it during a run, then use the connector's current queryable ID. If an ID fails, rediscover the source by title. Never guess or store view IDs, page IDs, user IDs, property names, relation targets, templates, or options.

## Hard rules

- Task comments don't need Johan's approval. Post them directly, following the comment guidelines here. Every client update or small progress step gets a concise, context-rich comment with what was sent, the options, what's open, who we're waiting on, the email thread link, and files such as designs or screenshots attached; log the time the same day.
- Search before creating. Update the existing record when it owns the same work, even when thin or stale.
- Never assume project, people, dates, duration, status, or relations. Ask one focused question when a missing fact could change the result.
- Write task bodies as two or three short paragraphs followed by useful context bullets in ordinary sentences. No headings, Done when lists, acceptance checklists, generic steps, speculative requirements, or repeated properties. A full task means complete necessary fields and sufficient concise context.
- Describe the client team or project's accepted request as work to do. Keep individual owners in Owner and Assignee, not personal attribution or conversation history in prose.
- Due date is mandatory on every task, whatever its status, including backlog and Done. Never create, update, or close a task with an empty Due date. When no date is given for open work, ask one focused question; for completed work, use the actual completion date. Fill an empty Due date whenever you touch a task.
- Priority is mandatory for an active task. Preserve explicit priority and use clear urgency and deadline context for routine judgment. Never silently clear it. Ask a focused question before declaring the task prepared if priority remains materially ambiguous.
- Store working photos and files in Assets and refer to them when useful. Use body attachments only when Assets cannot hold the file. Comments are for real discussion, feedback, decisions, and delivered results, never just source history or asset storage. A specialist’s explicitly requested cross-system sync may use its concise verified-match comment as a narrow exception; ordinary source capture belongs in useful body context.
- After a write, fetch the affected page and confirm the change persisted.
- Created by and Last edited by show the connection's bot. On every task you create or update, set the Done by people property to the person who connected the Notion account, read from Retrieve token's bot user (`bot.owner.user`). Sign every comment with a custom `display_name` holding only your agent name.
- Record only the actual duration and date in Timesheets. Ask when either is missing and never infer it. Never set a billable flag or record or report a time of day.

## Workflow

For intake or decomposition, first follow [triage and slicing](references/triage-and-slicing.md). For completed-work coordination, `deliver` owns the cross-system handover while this skill owns Notion records and actual time.

1. Resolve the live schema, Owner, and Assignee, then find, create, or update the task: [records-and-tasks.md](references/records-and-tasks.md).
2. Before assigning or planning, inspect the Project and the Assignee's load: [workload.md](references/workload.md).
3. Keep the task body, comments, and attachments current: [journal-and-artifacts.md](references/journal-and-artifacts.md).
4. Log time, mark Done, and report: [time-and-completion.md](references/time-and-completion.md).

Finish when the correct Notion records match the request, no duplicate exists, every touched task has a Due date, required relations are set, authorized status changes persisted, and time is in Timesheets.
