### Shopify conversation

## Goal

Prepare and support resolution of a Shopify issue, or leave it with a named owner, documented case, concrete next action, and deadline. When the user asks for live support without naming a channel, default to chat preparation. Before contacting an advisor or sending a reply, show the exact draft and destination and obtain approval to send. A request for help does not approve unseen messages. If a phone conversation cannot satisfy that approval boundary, prepare a call brief for the user rather than conducting an unscripted call autonomously.

Write every user-facing message like a real merchant rather than a support script.

## Hard rules

- Human-facing messages, including opening contact, replies, nudges, and requests to close a conversation, require the user's approval before sending. Monitoring a transcript and preparing evidence may continue without posting. An inactivity warning is not an exception to approval.
- Never press **End chat**. Ask the advisor to close the conversation, then wait until the interface confirms that the advisor ended it.
- Do not open a replacement chat while an active one exists. If a security challenge, MFA, or owner verification appears, ask the user to complete it; never bypass it.
- Obtain explicit user approval before accepting, authorizing, or submitting a money-related, irreversible, or legally consequential action.
- Never use deception, guilt, threats, repeated pressure, false praise, or attempts to make an advisor break policy.
- Use the [Shopify chargeback](shopify-chargeback.md) playbook for card-network dispute responses.
- Chat messages are plain text only: no em dashes, Markdown, tables, or key/value dumps.

## Workflow

1. Classify before contact. Read [support-routes](../references/shopify/support-routes.md), then exactly one of [billing](../references/shopify/billing.md), [shipping](../references/shopify/shipping.md), [payments](../references/shopify/payments.md) for payouts, holds, reserves, and verification requests, or [general](../references/shopify/general.md). Identify the store, the real owner, any in-product record with a deadline, and the desired outcome.
2. Choose and preserve the channel, recover from UI changes, and prepare the case packet: [classify-and-channel](../references/shopify/classify-and-channel.md).
3. Open cleanly, advocate, respect authorization boundaries, and run the live chat: [conversation](../references/shopify/conversation.md).
4. Let the advisor close with a useful outcome, then recap and follow up: [closure](../references/shopify/closure.md).
