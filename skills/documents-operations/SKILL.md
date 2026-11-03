---
name: |-
  documents-operations
description: |-
  Finds and maintains durable documentation in the Notion Documents database, including creating, updating, consolidating, and formatting canonical pages while avoiding duplicates and unconfirmed policy changes.
notion_page_id: 3dffc798-2e43-8175-b1e5-d85d588e05b7
---

# documents-operations

Notion Documents is the source for saved documentation. Use it for durable knowledge that someone should understand months later without extra context.

Notion Documents hold only final, approved documentation, reports, or assets that may be shared with the customer. While a report or document is being worked on, keep it as internal temporary documentation (files in the working directory, the conversation, or the task's draft comment) and add it to Notion Documents only once the final is approved. Keep Notion clean: no drafts, no noise.

## Hard rules

- Search Documents before creating. Read likely matches and update the page that already owns the subject, even when it is stale, thin, or inconvenient to find.
- Never store or guess database IDs, page IDs, property names, relation targets, templates, or option values.
- Never invent policies, ownership, deadlines, results, causes, or process steps.
- Before saving a material policy, strategy, or process change, explain the exact change and get confirmation.
- Use concise, reader-facing prose. Do not use em dashes or en dashes.
- Use `reporting` for analytical reports and `brainstorm` for unresolved planning.

## Workflow

1. Discover the live Documents and Projects databases, resolve the topic, and find the owning page: [find-the-document.md](references/find-the-document.md).
2. Gather sources, write, and choose the smallest structure: [gather-and-write.md](references/gather-and-write.md).
3. Update the canonical page safely and verify: [update-safely.md](references/update-safely.md).

Finish when the correct page was created, updated, consolidated, reformatted, or intentionally left unchanged without duplication. If the user asks how a process works and no document exists, state what was checked and offer to create it.
