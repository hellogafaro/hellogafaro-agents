---
name: |-
  support
description: |-
  Entry point for merchant and customer support cases: conversations with Shopify's support team about billing, payouts and holds, account access, shipping, apps, or defects; card-network disputes and chargeback responses; and owner-approved remote sessions on a customer's Windows or Mac over Tailscale and SSH. Use when a case needs Shopify's support team, a dispute response, or hands-on help on a customer's machine, not for fixing code you control or for running campaigns.
notion_page_id: 3fffc798-2e43-8179-976c-cb9b5222fc53
---

# support

Turn a support request into a triaged case, an approved action, and a verified outcome. This skill routes and sequences; the loop skills (`investigate`, `verify`, `deliver`, `write`, `handoff`) do the stages, and `tasks-operations` keeps the record.

## Enter

1. Read the request and the project instructions. Identify the customer or store, the real owner, the deadline if any record carries one, and the outcome the person wants. Size the intake as described below and find or create the owning task through `tasks-operations` only when that calls for it.
2. Match the request to exactly one playbook. When none fits, say so and fall back to the loop stages directly.
3. Copy the playbook's steps into your todo list before acting and work them in order. Approval steps and verification steps are never skipped.

| Request | Playbook |
| --- | --- |
| A Shopify merchant issue with payments, billing, shipping, orders, checkout, storefront, apps, defects, or account access that needs Shopify's support | [Shopify conversation](playbooks/shopify-conversation.md) |
| A card-network dispute or chargeback that needs an evidence response in Shopify | [Shopify chargeback](playbooks/shopify-chargeback.md) |
| A customer's Windows or Mac machine needs diagnosis, a printer or disk or service fix, or onboarding over the customer's Tailscale network | [Remote session](playbooks/remote-session.md) |

## Size the work

Decide the path before the first step and say which one you took.

- **Simple**: one clear change or question with a small blast radius, no money moved, no new data collected, and no customer-facing behavior changed. Read only the matching playbook and `verify`, and close through `deliver` when a task owns the work. Where a playbook step says "through `investigate`" or "through `implement`", apply the step's intent (diagnose with evidence, make the smallest change) without opening those skills. Reproduce, change, verify on the surface, report. No task unless one exists or the user asked for one. A replayed reproduction that passes on the same surface is a passed check even when the project has no verification recipe; the recipe item alone is reported as unverified.
- **Complex**: several parts, an unsettled design, dependencies, a customer-facing change, or more than one owner. Run the full playbook with intake, `brainstorm` for real forks, slices, and `deliver`. A change that collects personal data or feeds an audience also needs the consent basis stated in the contract.
- **Data-critical**: the result depends on figures, comparisons, or patterns, or it will move money, budgets, inventory, or audiences by a computed amount. Every number goes through `analyze` before it is stated or acted on, with the script and data retained, and the approval step shows the computed figures. Data-critical adds to complex; it does not replace it.

A request can move up a path mid-way when evidence shows it is bigger than it looked; it never moves down.

## Size the intake

Intake is one lookup, not a ritual. When the request names a task, use it. Otherwise search Notion once for a task that already owns this work and attach to it. When none exists: a question, a tentative idea, or a read-only analysis needs no task; a small, clear change the user did not ask to record proceeds without one and the reply says so; accepted or substantial work gets its task created before the first change. At the end, `deliver` closes only a task that exists; without one, report readiness and the evidence instead of closure.

## Rules that hold in every playbook

- Every human-facing message, whether to a customer, an advisor, or a vendor, is shown with its destination and recipients and approved before it is sent. Monitoring and preparing evidence continue without posting.
- Money-related, irreversible, legally consequential, or security-sensitive actions need explicit approval for that specific action. A request for help is not that approval.
- Security challenges, MFA, and identity checks belong to the account owner; ask them to complete it and never bypass it.
- Use Executor, the organization's integrations layer (`integrations.search` by provider, `integrations.describe` for the signature; Shopify, Gmail, and the rest, on the merchant's labelled account from its project context) for read-only record data when it is more reliable than the UI, and the browser for state shown only in the product. Never pull credentials into tool results.
- Verify the outcome on the real record before closing: the dispute shows submitted, the advisor confirmed the resolution, the service runs. A sent message or a completed command is not the outcome.

## Reply

Lead with the case state and the next action, name who owns it, and keep message drafts verbatim in a code block when approval is needed. Detailed evidence goes with the task through `deliver`.
