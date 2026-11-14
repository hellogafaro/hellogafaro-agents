---
name: |-
  calendar
description: |-
  Reviews authorized calendars for availability, conflicts, and meeting preparation, or creates and changes events on request after verifying the account, calendar, tool capabilities, and permissions.
notion_page_id: 3dffc798-2e43-8199-b3cb-fcf247dfdf73
---

# calendar

Live calendars are the source for availability, commitments, attendees, recurrence, reminders, and event status. Before selecting a connection, check the active agent's connections and tools, inspect their calendar operations and permissions, and verify account ownership. Don't require a named connector, transport, or local tool.

## Hard rules

- Resolve the authorized account and calendar before reading or acting, and pass verified selectors on each call when supported. Never rely on a default account or substitute another user's calendar. An owner-bound or shared connection is not per-user access; verify authority before using it.
- Never move or cancel an event without a direct request. Draft attendee communication when useful; sending it needs separate authorization.
- Before sending any human-facing attendee message or invitation, show the exact text, destination, and attendees and obtain approval to send.
- Never infer a timezone from a name, company, phone number, or email domain.
- Never invent attendees, addresses, availability, links, locations, recurrence, or event details.
- When a recurring event's change scope is missing, ask and don't change it. Never make a broader change than requested.
- Refetch immediately before reporting live availability or changing an event, and verify every write afterwards.

## Workflow

Read only the reference files the current operation needs.

1. Check available connections, inspect live operation schemas, resolve the authorized account and calendar, fetch the smallest range, and verify state: [calendar-state.md](references/calendar-state.md).
2. Review commitments, conflicts, and same-day changes, then recommend: [review-and-recommend.md](references/review-and-recommend.md).
3. Create, move, or change events: [schedule-and-change.md](references/schedule-and-change.md).
4. Reminders and meeting preparation: [reminders-and-preparation.md](references/reminders-and-preparation.md).

Finish when the requested scope was checked, no detail was guessed, protected time was respected, every change was verified live, and unavailable calendars or failed actions were reported precisely.
