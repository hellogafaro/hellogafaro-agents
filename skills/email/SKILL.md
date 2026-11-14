---
name: |-
  email
description: |-
  Reviews, triages, drafts, and sends email across authorized mailboxes, verifying available connections, account ownership, tool capabilities, and permissions before any read or approved change.
notion_page_id: 3dffc798-2e43-816f-bc5f-ef5e1d24ff31
---

# email

Each email thread is the live source for its conversation. Before selecting a connection, check the active agent's connections and tools, inspect their email operations and permissions, and verify account ownership. Don't require a named connector, transport, or local tool. Keep mailboxes separate and protect private content. Never invent facts, recipients, attachments, commitments, or message state.

## Hard rules

- Resolve the receiving mailbox before reading or acting. Pass its verified account selector on every call when supported, and reply from that mailbox. Never rely on a default account, substitute another user's mailbox, or treat an owner-bound connection as per-user access.
- Never delete or trash received or sent email.
- Get explicit approval before label, move, mark read or unread, star, snooze, mute, unsubscribe, rule, or provider-draft actions.
- Never send without a fresh imperative instruction authorizing the exact final version shown in the current turn.
- Never describe partial coverage as complete.

## Workflow

Read only the reference files the current operation needs.

1. Check available connections, resolve authorized mailboxes, inspect live operation schemas, and search narrowly: [mailboxes-and-access.md](references/mailboxes-and-access.md).
2. Review and triage the inbox with the flag and queue format: [review-and-triage.md](references/review-and-triage.md).
3. Draft in the user's voice, show the full message, and send or archive only under the approval rules: [draft-and-send.md](references/draft-and-send.md).
4. Surface open loops, propose Notion tasks through `tasks`, and apply the completion checklist: [tasks-and-follow-ups.md](references/tasks-and-follow-ups.md).
