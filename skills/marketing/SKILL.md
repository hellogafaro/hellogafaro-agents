---
name: |-
  marketing
description: |-
  Entry point for growth and marketing work on a client brand: campaign briefs and plans, paid ads on Meta, Google, and TikTok, Klaviyo email and SMS flows, and performance analysis from GA4, PostHog, Search Console, and Shopify. Use when a request concerns acquisition, retention, creative, or channel results rather than code or support.
notion_page_id: 3fffc798-2e43-81a4-80ad-da81ba5d9d6c
---

# marketing

Turn a marketing request for a brand into a planned, executed, and measured piece of work. This skill routes and sequences; the loop skills (`research`, `investigate`, `brainstorm`, `implement`, `verify`, `reporting`, `write`, `deliver`) do the stages, the host's integrations are the hands on every platform, and `tasks-operations` keeps the record.

## Enter

1. Read the request and the project instructions. Identify the brand, its connected accounts from its project context, the goal in business terms (revenue, orders, leads, retention, awareness), the period, and the budget or constraints already set. Size the intake as described below and find or create the owning task through `tasks-operations` only when that calls for it.
2. Match the request to exactly one playbook. When none fits, say so and fall back to the loop stages directly.
3. Copy the playbook's steps into your todo list before acting and work them in order. Approval and measurement steps are never skipped.

| Request | Playbook |
| --- | --- |
| Plan a campaign, launch, promotion, or quarter: audience, offer, channels, budget, creative, timeline | [Campaign brief](playbooks/campaign-brief.md) |
| Launch, change, pause, or optimize paid campaigns on Meta, Google, or TikTok | [Paid ads](playbooks/paid-ads.md) |
| Build or change a Klaviyo campaign, flow, segment, or template | [Email and SMS](playbooks/email-and-sms.md) |
| Explain results, find what drove a change, report a period, or audit a channel | [Performance analysis](playbooks/performance-analysis.md) |

## Size the work

Decide the path before the first step and say which one you took.

- **Simple**: one clear change or question with a small blast radius, no money moved, no new data collected, and no customer-facing behavior changed. Read only the matching playbook and `verify`, and close through `deliver`. Where a playbook step says "through `investigate`" or "through `implement`", apply the step's intent (diagnose with evidence, make the smallest change) without opening those skills. Reproduce, change, verify on the surface, report. No task unless one exists or the user asked for one. A replayed reproduction that passes on the same surface is a passed check even when the project has no verification recipe; the recipe item alone is reported as unverified.
- **Complex**: several parts, an unsettled design, dependencies, a customer-facing change, or more than one owner. Run the full playbook with intake, `brainstorm` for real forks, slices, and `deliver`. A change that collects personal data or feeds an audience also needs the consent basis stated in the contract.
- **Data-critical**: the result depends on figures, comparisons, or patterns, or it will move money, budgets, inventory, or audiences by a computed amount. Every number goes through `analyze` before it is stated or acted on, with the script and data retained, and the approval step shows the computed figures. Data-critical adds to complex; it does not replace it.

A request can move up a path mid-way when evidence shows it is bigger than it looked; it never moves down.

## Size the intake

Intake is one lookup, not a ritual. When the request names a task, use it. Otherwise search Notion once for a task that already owns this work and attach to it. When none exists: a question, a tentative idea, or a read-only analysis needs no task; a small, clear change the user did not ask to record proceeds without one and the reply says so; accepted or substantial work gets its task created before the first change. At the end, close through `deliver` either way: it closes the task when one exists, and always cleans up and ends with the close-out list.

## Accounts and access

Providers (Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, Google Analytics, Search Console, Gmail) are reached through Executor, the organization's single integrations layer: call its `integrations.search` with the provider name to list that app's tools and connected accounts, `integrations.describe` for a tool's exact signature, then call the tool with the labelled account. A generic tool search will not find them; the integrations tools are the registry. Tools and accounts carry labels; use them, never a remembered id. Which account, property, pixel, or list belongs to a brand is a brand fact kept in that brand's Notion project context; resolve it there first and record it beside every figure. A tool that is unavailable, needs a reconnect, or returns an auth error is a gap to report with its recovery step, never something to work around. Save every response to a file and compute through `analyze`; never pull credentials or tokens into tool results, logs, or chat.

## Rules that hold in every playbook

- Read the brand's own context first: voice, offers, exclusions, past results, and open decisions in its Notion project. Keep brand-specific facts there, never in this skill.
- Every number comes from a connected provider through the host's integrations and is computed through `analyze` from retained data, with provider, account, tool, date window, and metric definition recorded beside it. Platform dashboards differ on attribution and timing; name the difference when comparing.
- Spend, audience, bid, budget, and send actions are writes. Each needs the user's explicit approval for that specific change, shown as the exact change on the exact account before it is made, and is verified on the platform afterwards.
- Anything a customer will see (ad copy, creative, email, SMS, landing copy) is drafted through `write` in the brand's voice and approved before it is published or sent.
- Define what success looks like and how it will be measured before launching anything; measure it afterwards on the same definition.

## Reply

Lead with the decision or result, the numbers that support it with their source and window, and the next action. Keep drafts and detailed tables in the working space; attach only the approved final through `deliver`.
