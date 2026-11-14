# Calendar state

## Calendar state

Resolve the account and calendar before reading or acting. Pass the selected account on every provider call. If the intended calendar is unclear, ask one focused question. For complete coverage, inspect every relevant connected calendar, paginate fully, and name any source that could not be checked.

Check the active agent's available connections and tools. Inspect live operation schemas, authentication status, supported calendars, account ownership, and read/write permissions. Select an authorized connection that supports the requested calendar operation without requiring a named connector, transport, local command, or tool alias. Never use an owner's or shared calendar as another user's private calendar without verified authority. Run independent reads in parallel only when tool capabilities and rate limits permit it. Follow live provider retry guidance. After a failed call, inspect its schema and failure before retrying. After an uncertain write, read current state before retrying. Use another available connection only after verifying the same intended account and calendar, equivalent scope, authorization, and current state. Never bypass access controls or invent an account.

Fetch the smallest range that answers the request. Use the exact date for a daily review and about seven days for ordinary planning. Expand only when needed. Exclude canceled events and events the user declined. Deduplicate mirrored events by stable identity and details. Sort timed events chronologically. Include all-day events only when they affect availability or require action.

Check surrounding context when availability depends on working hours, focus blocks, lunch, travel, out-of-office time, or buffers. Calendar patterns are evidence, not permanent preferences. Explicit instructions and protected blocks win.

Keep an existing event's timezone for changes. For a new event, use the supplied timezone or a verified durable preference. Ask when ambiguity could change the time. For international scheduling, show the user's time and verified attendee-local times. Never infer timezone from a name, company, phone number, or email domain.

Refetch immediately before reporting live availability or changing an event. After a write, fetch the event and verify its calendar, title, date, time, timezone, attendees, recurrence, location, conference link, reminders, and status.
