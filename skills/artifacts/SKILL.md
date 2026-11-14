---
name: |-
  artifacts
description: |-
  Creates, checks, shows, and shares visual artifacts that help a person decide, verify, or understand, such as screenshots and recordings as proof, charts, diagrams, HTML reports, plans and documents, and mockups or design options. Publishes them to public links that never expire, and finds or deletes them later, with `ntncode artifact`. Use when seeing something says more than prose, or when a file must be opened outside this server.
notion_page_id: 418fc798-2e43-8113-88d4-cac65b0d990c
---

# artifacts

When another skill calls this one for a visual subtask, return the inspected artifact and its limits to that skill. Do not restart planning, verification, or delivery it owns.

Make the relevant thing visible with the smallest artifact that answers the question.

## Choose the form

| Need | Form | Read first |
| --- | --- | --- |
| Prove a state or what happened | A screenshot for a state, a recording or ordered captures for a change | [visual evidence](references/visual-evidence.md) |
| Settle a design choice | Two or three distinct options, or a prototype | [options and prototypes](references/options-and-prototypes.md) |
| Present a plan, report, notes, or document | One self-contained HTML page | [canvas style](references/canvas-style.md), [the CSS kit](references/kit.css), and the matching [plan](examples/plan.html), [report](examples/report.html), or [mockup](examples/mockup.html) example |
| Compare measured values | A chart, inside a page when it needs context | [canvas style](references/canvas-style.md) |
| Explain relationships or a flow | A diagram, with the host's native renderer when it is enough |  |

Say whether the artifact is observed evidence, a proposed design, or an illustration. A mockup or generated image never proves that something exists. Ask for missing decision-critical data instead of inventing values.

## Build

HTML artifacts use the shared kit: flat hierarchy, restrained type, neutral palette, dark mode, and the credits footer, with only the components the page uses. Write one self-contained file with inline styles and no build step. Small local scripts are allowed only for requested option switching or prototype interaction, never for real writes. Project UI options follow the project's own design system unless the user is choosing a new direction. Screenshots and recordings stay faithful to what was observed.

## Check and show

Render every authored artifact and inspect its important states: a narrow layout where relevant, the top, middle, and bottom of a long page, and each option. Fix overflow, clipping, unreadable labels, and broken interactions before presenting it. If rendering is unavailable, say so instead of claiming visual QA.

When the current tools can display the artifact in the conversation, show it inline, and give its path or link too. Say in one sentence what it shows. A local path or an unverified attachment is not delivery.

## Share

When someone outside this server must open it, publish it with `ntncode artifact` as [publishing](references/publishing.md) says. Look for it first with `list`, pass `--project` and `--task` whenever they are known, and use a title that says what it shows. Never publish secrets, credentials, client-private data, or personal data.

For a requested Notion save, use `documents` for a durable document or `tasks` for task evidence. Use the upload's native attachment or embed, and fetch the destination to verify it. Keep private material within its approved audience; never publish it just to embed it.

## Hand off

Use `verify` to judge whether the evidence supports the outcome, `brainstorm` to decide between options, `implement` for production code, `reporting` for analytical claims, and `deliver` for completion records and stakeholder communication. Proof and report pages hold the evidence and the limits needed to read it; follow-ups belong in the task, pull request, or handoff. Apply `write`, and keep the chat shorter than the artifact.
