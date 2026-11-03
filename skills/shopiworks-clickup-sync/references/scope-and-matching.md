# Resolve the scope and match before creating

## Resolve the scope

Determine whether the user explicitly requests ClickUp intake synchronization, publication, or both. Do only those authorized parts. A source link supplied for understanding or Notion capture permits the needed read, not an outbound sync or provider update. Use the requested tasks, Projects, dates, and range. For a weekly publication, use the user's current week and verified timezone unless specified otherwise. Ask one focused question when scope or a required fact remains materially ambiguous, or skip and report the affected item.

For intake, resolve Johan live and read the assigned ClickUp requests, descriptions, relevant comments, attachments, and links. Do not apply the outbound completed-work filter to intake. For publication, query relevant Notion tasks, result comments, deliverables, and Timesheets. Default to completed work supported by Timesheets. Publish incomplete work only when requested.

Resolve the live Notion Projects and required schemas through `tasks-operations`. Through the connected ClickUp MCP, discover ClickUp's workspace, space, folder, lists, statuses, members, task fields, and time-entry schema. Match Project destinations by live name and hierarchy. Never guess or store mutable IDs or member mappings in this skill. Use [status mapping](status-mapping.md) for observed label profiles and discovery fallbacks; revalidate the target task’s available options before using a saved profile. Follow pagination until the scoped search, comments, and time entries are complete.

## Match before creating

Use the canonical ClickUp URL or task ID recorded on Notion as the durable match. Verify that the linked task owns the same outcome and Project. Do not match by title alone.

For intake, search Notion for that URL or ID first, then search the resolved Project by outcome and relevant terms. Read plausible tasks and their comments before creating, including completed, thin, or stale records outside the intake period. For publication without a recorded match, search the confirmed ClickUp list and read plausible matches. Ambiguous or conflicting matches need input, not another task.

Reuse the existing task for the same outcome. Ordinary Notion capture may weave a useful ClickUp source link into its body without initiating synchronization. If the canonical source URL is already recorded in the body or a comment, reuse it and do not post another match comment. For an explicitly requested sync with no recorded match, preserve the verified cross-system match as its narrow specialist exception to source-history-only comments: when first matched or created, use one short English prose sentence beginning “The original ClickUp task is”, with the task ID as the link text for its canonical ClickUp URL. Do not add a formal “Matched request” label or repeat the task scope. Show the exact draft and destination, then obtain approval before posting. Check existing content and comments first. Reuse a URL already recorded rather than adding another comment or repeating it in the body. Fetch any posted comment to verify the link.

Read current tasks, comments, and time before writing. Skip unchanged content and comments whose meaning is already present. After an uncertain write in either system, read current state before retrying. Never replay a write blindly or delete tasks or time entries.
