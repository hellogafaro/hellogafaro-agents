# Triage and slicing

Read the accepted request and relevant project context, then search for the owning task and related work before creating anything. A quick question or tentative idea is not automatically a new task. Accepted execution should have a canonical task; update an existing one when it owns the same outcome.

Check impact, urgency, existing implementation, duplicate reports, and concrete blockers. Use `investigate` to establish a reported defect or unclear current state. Distinguish confirmed facts from a requester's hypothesis. Do not close or reject work solely because a keyword search found something similar.

Classify the next action as ready to execute, needs a decision, needs evidence or access, or already represented by existing work. These are reasoning categories, not new database statuses. Use the live schema's actual options and preserve the existing record where appropriate.

A ready brief identifies the observable outcome, necessary constraints, sources, owner, project, priority, and real dependencies. Record it using the existing task prose conventions; readiness does not require headings, acceptance checklists, or an implementation specification. Ask only for a missing fact that prevents a safe next action.

Split large work into the fewest distinct outcomes that can be independently demonstrated or verified. For features, favor narrow end-to-end slices over isolated technical layers. Link genuine blockers using supported relations or concise body context. Start only slices whose prerequisites are met; do not manufacture parallelism across shared state.

For a wide migration, allow expand, migrate, contract stages when independent slices otherwise cannot stay compatible. Keep speculative follow-ups separate from accepted scope and leave them uncreated until authorized. Do not turn every internal step, check, or agent assignment into a task.
