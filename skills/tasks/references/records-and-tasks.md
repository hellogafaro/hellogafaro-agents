# Records and tasks

## Records

Use the selected Notion connection. Resolve live property names and option values. Never write formulas or read-only properties. Resolve Owner and Assignee through workspace users. Owner is the human accountable for the work; Assignee executes it.

Search before creating. Update the existing record when it owns the same work, even when thin or stale. Read related Projects, Meetings, Documents, tasks, and source links only when they affect scope, ownership, timing, or execution.

Apply an exact routine change when the user identifies the record and action. Inspect Notion before resolving ambiguous or bulk changes, workload conflicts, or unclear ownership. Never assume project, people, dates, duration, status, or relations. Ask one focused question when a missing fact could change the result. Resolve priority through explicit instructions or clear urgency and deadline context as described below.

After a write, fetch the affected page and confirm the change persisted. If the result is uncertain, read current state before retrying. Do not retry through another connector. Use the fetched canonical Notion page URL in output. Do not expose raw query URLs that omit `/p/`.

## Tasks

Create one task per real outcome. Do not turn vague ideas, passive information, or unowned discussion into tasks. An active task needs a clear name, Owner, Assignee, Project, Priority, Status, Recurrence, and Due date. Every task needs a Due date, including backlog and completed work; never leave it empty.

Priority is mandatory for an active task. Preserve an explicit priority. When none is stated, use clear task urgency and deadline context to select the appropriate live Priority option through routine judgment. A launch needed today has high urgency. Never silently clear priority to avoid resolving it. If priority remains materially ambiguous, ask one focused question before declaring the task prepared. Verify the saved Priority along with the other necessary fields.

Start titles with a verb when natural. Use sentence case, normally no more than 12 words. Avoid colons, filler, and client or project names unless needed for clarity.

Write two or three short paragraphs explaining the work and why it is needed, followed by bullets containing only useful context in ordinary sentences. Keep the whole brief concise. A full task means complete necessary fields and enough context to execute, not an implementation specification.

Do not add headings, Done when lists, acceptance criteria or checklists, product-photo sections, generic steps, speculative requirements, or repeated operational properties. Include necessary constraints, dependencies, unknowns, source links, assets, and repository context only when they help someone execute the accepted work. Do not add requirements to make the record look complete.

Refer to the client team or project, not individual conversation participants. Owner and Assignee retain the actual individual owners. Preserve the team's accepted request as work to do, not a transcript, personal attribution, quoted wording, or conversational chronology.

Context bullets are complete sentences. Do not use key-value prose such as Source:, Repository:, Asset:, or "her wording was". Weave necessary links into sentences. Write file names, paths and domains as inline code, because Notion turns bare names such as findings.md into links to websites. Omit source history that gives the executor no useful context. Store the inputs the work needs, such as briefs, client files and reference images, in Assets and mention them in useful context; use body attachments only when Assets cannot hold the file. Never put results or completion state in the body or Assets; they go in comments. Do not create comments merely to preserve trimmed source history or hold an asset. The specialist verified-match comment for explicitly requested cross-system sync is the narrow exception, with its communication approval unchanged. Real discussion, feedback, decisions, and delivered results can be comments.

Internal tasks use English unless the user asks otherwise. Project language applies to client-facing work, not internal records by default.

Record a blocker only when a concrete condition prevents progress. Name its owner and smallest unblocking action. Change status when the user requests it or the source proves the new state. Cancel only from an explicit request or confirmed decision, and preserve the reason.

Extract only confirmed actions from Meetings, Documents, email, notes, or plans. Preserve real owners, dates, decisions, dependencies, constraints, and useful source links. Discussion alone is not work. For large requests, create the fewest tasks that represent distinct outcomes; use now, next, and later only when sequencing helps.

For work from a Meeting, read its Project relation. Use the single linked Project for tasks and time. If none or more than one is linked, ask which Project owns the work. Do not edit the Meeting. Keep other source systems read-only; use their specialist skill for any separately authorized change.

For work recorded after completion, write the task as it would originally have been assigned. Use the actual completion date for Due date and Timesheet date. When the date is missing, ask `Was this completed today?`; if not, ask for the date. Never default silently.
