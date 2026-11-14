---
name: |-
  marketing
description: |-
  Entry point for growth and marketing work on a client brand: campaign briefs and plans, paid ads on Meta, Google, and TikTok, Klaviyo email and SMS flows, and performance analysis from GA4, PostHog, Search Console, and Shopify. Use when a request concerns acquisition, retention, creative, or channel results rather than code or support.
notion_page_id: 3fffc798-2e43-81a4-80ad-da81ba5d9d6c
---

# marketing

Turn a marketing request for a brand into planned, executed, and measured work. This skill routes and sequences. The loop skills (`research`, `investigate`, `brainstorm`, `implement`, `verify`, `reporting`, `write`, `deliver`) do the stages, the host's integrations act on every platform, and `tasks` keeps the record.

## Enter

1. Read the request and the project instructions. Identify the brand, its connected accounts from its project context, the goal in business terms (revenue, orders, leads, retention, awareness), the period, and any budget or constraints already set. Size the intake as below, and find or create the owning task through `tasks` only when that calls for it.
2. Match the request to exactly one playbook. When none fits, say so and run the loop stages directly.
3. Copy the playbook's steps into your todo list before acting and work them in order. Never skip approval and measurement steps.

| Request | Playbook |
| --- | --- |
| Plan a campaign, launch, promotion, or quarter: audience, offer, channels, budget, creative, timeline | [Campaign brief](playbooks/campaign-brief.md) |
| Launch, change, pause, or optimize paid campaigns on Meta, Google, or TikTok | [Paid ads](playbooks/paid-ads.md) |
| Build or change a Klaviyo campaign, flow, segment, or template | [Email and SMS](playbooks/email-and-sms.md) |
| Explain results, find what drove a change, report a period, or audit a channel | [Performance analysis](playbooks/performance-analysis.md) |

## Size the work

Decide the path before the first step and say which one you took.

- A simple request is one clear change or question with a small blast radius, no money moved, no new data collected, and no customer-facing behavior changed. Where a playbook step says "through `investigate`" or "through `implement`", apply its intent (diagnose with evidence, make the smallest change) without opening those skills: reproduce, change, verify on the surface, report. A replayed reproduction that passes on the same surface is a passed check even when the project has no verification recipe; only the recipe item is reported as unverified.
- A complex request has several parts, an unsettled design, dependencies, a customer-facing change, or more than one owner. Run the full playbook with intake, `brainstorm` for real forks, slices, and `deliver`. A change that collects personal data or feeds an audience also states its consent basis in the contract.
- A data-critical request depends on figures, comparisons, or patterns, or will move money, budgets, inventory, or audiences by a computed amount. Every number goes through `analyze` before it is stated or acted on, with the script and data retained, and the approval step shows the computed figures. Data-critical adds to complex; it does not replace it.

A request can move up a path mid-way when evidence shows it is bigger than it looked; it never moves down.

## Size the intake

Intake is one lookup, not a ritual. Use the task the request names; otherwise search Notion once for a task that already owns this work and attach to it. When accepted or substantial work has none, create it before the first change.

## Accounts and access

Reach providers (Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, Google Analytics, Search Console, Gmail) through Executor: `search` with the provider name lists that app's tools and connected accounts, and `describe` gives a tool's exact signature. A generic tool search will not find them; Executor's tools are the registry. Use the labels on tools and accounts, never a remembered id. Which account, property, pixel, or list belongs to a brand is a brand fact in its Notion project context; resolve it there first. A tool that is unavailable, needs a reconnect, or returns an auth error is a gap to report with its recovery step, never something to work around. Save every response to a file. Never pull credentials or tokens into tool results, logs, or chat.

## Rules for every playbook

- Read the brand's own context in its Notion project first: voice, offers, exclusions, past results, and open decisions. Keep brand-specific facts there, never in this skill.
- Every number comes from a connected provider and is computed through `analyze` from retained data, with provider, account, tool, date window, and metric definition recorded beside it. Platform dashboards differ on attribution and timing; name the difference when comparing.
- Spend, audience, bid, budget, and send actions are writes. Each needs the user's explicit approval for that specific change, shown as the exact change on the exact account before it is made, and is verified on the platform afterwards.
- Draft anything a customer will see (ad copy, creative, email, SMS, landing copy) through `write` in the brand's voice, and get it approved before it is published or sent.
- Before launching anything, define success and how it will be measured; afterwards, measure it on the same definition.

## Reply

Lead with the decision or result, the supporting numbers with their source and window, and the next action. Keep drafts and detailed tables in the working space; attach only the approved final through `deliver`.
