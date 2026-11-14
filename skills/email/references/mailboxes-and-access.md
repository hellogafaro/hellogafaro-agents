# Mailboxes and access

## Connections and account scope

Check the active agent's available connections and tools before reading or acting. Inspect the live operation schemas, authentication status, supported accounts, and read/write permissions. Select an authorized connection that supports the required email operation; do not require a named connector, transport, local command, or tool alias.

Verify whose account the connection represents. A shared or owner-bound connection does not become the requesting user's mailbox merely because they started the run. Resolve the receiving mailbox explicitly and pass its verified selector on each call when the tool supports one. Reply from that same mailbox. Never rely on a default account or substitute another person's mailbox.

If scope is ambiguous, ask one concise question. For complete coverage, inventory the active agent's authorized email accounts, verify each mailbox's identity, paginate fully, and name any mailbox that could not be checked. If inventory is unavailable, use only verified accounts already in scope and disclose that inventory could not be verified. Never describe partial coverage as complete. Respect an explicit fixed mailbox scope rather than discovering additional mailboxes.

Choose the available read-only operation with the narrowest useful scope. Run independent reads in parallel only when the selected tools and rate limits permit it. Follow live provider retry guidance. After a failed call, inspect its schema and failure before retrying. After an uncertain write, inspect current state before retrying. Use another available connection only after verifying the same intended mailbox, equivalent required scope, authorization, and current state. Never bypass access controls or ask for raw credentials as a fallback.

## Retrieval and writes

Search narrowly by mailbox, sender, recipient, subject, date, label, or stable identity. Fetch metadata and previews first. For multi-thread reviews use bounded non-mutating reads to verify message order, senders, inbox state, and whether the latest inbound was answered. Fetch complete bodies when accurate classification, a decision, summary, draft, or write requires them. Paginate fully for complete searches, reviews, or counts.

Never delete or trash received or sent email. Minimize quoted bodies, forwarded chains, personal data, credentials, and sensitive attachments.

Require explicit approval before label, move, mark read or unread, star, snooze, mute, unsubscribe, rule, or provider-draft actions. Require explicit approval to archive a thread unless it qualifies for the send-completion rule in draft-and-send.md. A clear request for a displayed batch counts as approval for that scope. Archive or mark as done approves archiving the selected resolved thread but never authorizes an unapproved reply. Sending follows the stricter send-approval rule.
