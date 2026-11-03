# Map execution status and verify the write

Discover status options for the target task/list through the connected ClickUp MCP. Prefer the task’s expanded status metadata, then its list’s configured statuses. Match both the label and the provider category (`open`, `custom`, `done`, or `closed`); a comment or time entry is not completion.

If task options are absent and list discovery is denied for a shared task, try supported authenticated read-only programmatic metadata discovery. If necessary and available, inspect the status dropdown in an agent-owned browser session for the same authorized account. Never depend on the user’s local desktop or logged-in apps. Exhaust the available supported sources before asking the user; do not bypass access controls or require browser setup when the scoped API result is sufficient. Use the observed exact label with the dedicated MCP task-update tool, then fetch the task to verify the persisted status. If none is accessible, report status sync as incomplete; do not substitute another list’s labels.

## Observed Minicoton profiles

Verified on 8 October 2026. These are reference observations, not universal defaults; validate the profile against the target task’s current options. Somomu and unlisted profiles still require live discovery.

| Notion state | Shared with me profile | Auditoria web profile |
| --- | --- | --- |
| Not started | `abierta` (Not started) | `pendiente` (`open`) |
| In progress | `en progreso` (Active) | `en progreso` (`custom`) |
| Under review | `revisión` (Active) | `revisión` (`custom`) |
| Done | `cerrada` (Closed) | `cerrada` (`closed`) |
| Backlog, Blocked, Canceled | No corresponding option established | No corresponding option established |

Do not collapse Backlog, Blocked, or Canceled into another state without a verified equivalent or a user decision. Preserve Notion’s execution state during intake; an external request’s open/closed label does not prove internal progress or completion.

After authorized publication, reconcile the task’s status, result comment/evidence, and actual time as separate items. Re-read each changed destination, report any incomplete item, and never claim the full sync is complete merely because the comment and time succeeded.
