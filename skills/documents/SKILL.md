---
name: |-
  documents
description: |-
  Finds and maintains durable documentation in the Notion Documents database, including creating, updating, consolidating, and formatting canonical pages while avoiding duplicates and unconfirmed policy changes.
notion_page_id: 3dffc798-2e43-8175-b1e5-d85d588e05b7
---

# documents

Notion Documents is the source for saved documentation: durable knowledge someone should understand months later without extra context. It holds only final, approved documentation, reports, or assets that may be shared with the customer. Keep work in progress as internal temporary documentation (files in the working directory, the conversation, or the task's draft comment) until the final is approved. No drafts or noise in Notion.

## Hard rules

- Search Documents before creating. Read likely matches and update the page that already owns the subject, even when it is stale, thin, or hard to find.
- Never store or guess database IDs, page IDs, property names, relation targets, templates, or option values.
- Never invent policies, ownership, deadlines, results, causes, or process steps.
- Search, read, create, and update pages with the `notion` MCP server. Query databases with Executor's `tools.notion.api.dataSources.postDatabaseQuery`, because Notion's own query tool has a monthly allowance on this plan. Post comments with `tools.notion.api.comments.createAComment` and `display_name` set to `{ type: "custom", custom: { name } }`, which Notion's own comment tool can't set. Find tools by what they do.
- On every page you create or update, set the Done by people property to the person the Notion connection acts for. Sign every approved comment with a custom display name holding only your agent name.
- Before saving a material policy, strategy, or process change, explain the exact change and get confirmation.
- Write concise, reader-facing prose without em dashes or en dashes.
- Use `reporting` for analytical reports and `brainstorm` for unresolved planning.

## Workflow

1. Discover the live Documents and Projects databases, resolve the topic, and find the owning page: [find-the-document.md](references/find-the-document.md).
2. Gather sources, write, and choose the smallest structure: [gather-and-write.md](references/gather-and-write.md).
3. Update the canonical page safely and verify: [update-safely.md](references/update-safely.md).

Finish when the correct page was created, updated, consolidated, reformatted, or intentionally left unchanged, without duplication. If the user asks how a process works and no document exists, state what was checked and offer to create it.
