---
name: |-
  support
description: |-
  Entry point for merchant and customer support cases: conversations with Shopify's support team about billing, payouts and holds, account access, shipping, apps, or defects; card-network disputes and chargeback responses; and owner-approved remote sessions on a customer's Windows or Mac over Tailscale and SSH. Use when a case needs Shopify's support team, a dispute response, or hands-on help on a customer's machine, not for fixing code you control or for running campaigns.
notion_page_id: 3fffc798-2e43-8179-976c-cb9b5222fc53
---

# support

This skill routes and sequences a support case to an approved action and a verified outcome. The loop skills (`investigate`, `verify`, `deliver`, `write`, `handoff`) do the stages, and `tasks` keeps the record.

## Enter

1. Read the request and the project instructions. Identify the customer or store, the real owner, any deadline a record carries, and the outcome the person wants. Size the intake as below, and find or create the owning task through `tasks` only when that calls for it.
2. Match the request to exactly one playbook. When none fits, say so and run the loop stages directly.
3. Before acting, copy the playbook's steps into your todo list and work them in order. Never skip an approval or verification step.

| Request | Playbook |
| --- | --- |
| A Shopify merchant issue with payments, billing, shipping, orders, checkout, storefront, apps, defects, or account access that needs Shopify's support | [Shopify conversation](playbooks/shopify-conversation.md) |
| A card-network dispute or chargeback that needs an evidence response in Shopify | [Shopify chargeback](playbooks/shopify-chargeback.md) |
| A customer's Windows or Mac machine needs diagnosis, a printer or disk or service fix, or onboarding over the customer's Tailscale network | [Remote session](playbooks/remote-session.md) |

## Size the work

Pick the path before the first step and say which one you took. A request moves up a path mid-way when evidence shows it is bigger; it never moves down.

- **Simple.** One clear change or question with a small blast radius, no money moved, no new data collected, and no customer-facing behavior changed. Read only the matching playbook and `verify`, and close through `deliver`. Where a step says "through `investigate`" or "through `implement`", apply its intent (diagnose with evidence, make the smallest change) without opening those skills. Reproduce, change, verify on the surface, report. No task unless one exists or the user asked for one. A replayed reproduction that passes on the same surface is a passed check even without a verification recipe; only the recipe item is reported as unverified.
- **Complex.** Several parts, an unsettled design, dependencies, a customer-facing change, or more than one owner. Run the full playbook with intake, `brainstorm` for real forks, slices, and `deliver`. A change that collects personal data or feeds an audience also states its consent basis in the contract.
- **Data-critical.** The result depends on figures, comparisons, or patterns, or it will move money, budgets, inventory, or audiences by a computed amount. Every number goes through `analyze` before it is stated or acted on, with the script and data retained, and the approval step shows the computed figures. This adds to complex; it does not replace it.

## Size the intake

Intake is one lookup, not a ritual. Use the task the request names. Otherwise search Notion once for a task that owns this work and attach to it. If none exists, a question, tentative idea, or read-only analysis needs no task. A small, clear change nobody asked to record proceeds without one, and the reply says so. Accepted or substantial work gets its task created before the first change. Either way, close through `deliver`, which closes any task and ends with the close-out list.

## Rules for every playbook

- Show every message to a customer, advisor, or vendor with its destination and recipients, and get approval before sending. Monitoring and preparing evidence continue without posting.
- Money-related, irreversible, legally consequential, or security-sensitive actions need explicit approval for that specific action. A request for help is not that approval.
- Security challenges, MFA, and identity checks belong to the account owner. Ask them to complete it; never bypass it.
- For read-only record data, use Executor (`search` by provider, `describe` for the signature; Shopify, Gmail, and the rest) on the merchant's labelled account from its project context, when it is more reliable than the UI. Use the browser for state shown only in the product. Never pull credentials into tool results.
- Verify the outcome on the real record before closing: the dispute shows submitted, the advisor confirmed the resolution, the service runs. A sent message or a completed command is not the outcome.

## Reply

Lead with the case state and the next action, and name who owns it. When approval is needed, put message drafts verbatim in a code block. Detailed evidence goes with the task through `deliver`.
