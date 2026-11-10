---
name: |-
  shopiworks-clickup-sync
description: |-
  Imports or publishes explicitly requested Minicoton or Somomu ClickUp sync, with Notion as the execution record and verified results and actual time in Spanish.
notion_page_id: 3dffc798-2e43-8174-ab15-e851ed1722b5
disable-model-invocation: true
---

# shopiworks-clickup-sync

Run only when the user explicitly requests import from or publication to ClickUp for the live Projects `Minicoton` and `Somomu`. Notion is the default; Project membership, a ClickUp source link, task completion, or a generic closure request alone does not trigger outbound sync. Reading a supplied ClickUp request to understand and capture work does not authorize writing back to ClickUp. Include another Project only when the user explicitly adds it. ClickUp is a customer input source like email, not an equal source of truth. Notion owns internal execution, status, completion, and Timesheets.

## Hard rules

Before any human-facing message, including a ClickUp or internal Notion comment, show the exact draft, destination, mentions, and attachments and obtain approval to post. A sync or completion request does not approve unseen communication. Continue authorized record reconciliation separately and report pending communication as unsent.

For Johan's time entries, record only the actual duration and date. Omit `billable` from every write and keep times of day out of user and client reports; follow [publication.md](references/publication.md) for API date handling.

Use `tasks-operations` with the selected Notion connection for every Notion task, Project, completion, and Timesheet operation. Use the connected ClickUp MCP's dedicated tools (`clickup_get_task`, `clickup_create_comment`, `clickup_add_time_entry`, and so on) for ClickUp reads and writes, except the documented time-entry correction fallback in [publication.md](references/publication.md). Do not use Composio's ClickUp comment tools, a personal API token, or an ad hoc API call; Composio's ClickUp comment tools silently drop real mentions. An available authenticated read-only connector may discover status or list metadata when the dedicated MCP cannot expose it; this exception grants no alternative write authority.

Write concise natural English in Notion and concise natural neutral Spanish for the external provider in ClickUp. Rewrite for the reader rather than copying raw Spanish into Notion or raw English into ClickUp.

## Workflow

1. Resolve the scope (intake, publication, or both) and match before creating: [scope-and-matching.md](references/scope-and-matching.md).
2. Bring requests into Notion: [intake.md](references/intake.md).
3. Publish verified work to ClickUp: [publication.md](references/publication.md).
4. Verify every write and report in lettered Project groups: [verify-and-report.md](references/verify-and-report.md).

Finish when every authorized intake or publication is verified without duplicates, or reported with its blocker. Notion must remain the execution record throughout.
