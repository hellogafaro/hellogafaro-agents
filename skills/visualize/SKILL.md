---
name: |-
  visualize
description: |-
  Gathers visual evidence and presents design options, prototypes, diagrams, charts, and before/after comparisons. Use when seeing an artifact or difference supports a decision or verification.
notion_page_id: 3f2fc798-2e43-81dd-a988-c40858f35ddc
---

# visualize

When called for a visual subtask, return the inspected artifact and its limits to the caller. Do not restart planning, verification, or delivery that the caller already owns.

Make the relevant difference visible. Choose the smallest visual that answers the question, from a screenshot or diagram to a comparison or interactive prototype. Gathering evidence and presenting options are both first-class uses.

## Choose the job

- **Observe or gather proof:** capture the actual interface, interaction, or rendered artifact. Read [visual evidence](references/visual-evidence.md) before recording or comparing results.
- **Explore a choice:** show distinct alternatives that answer the same design question. Read [options and prototypes](references/options-and-prototypes.md). Use `brainstorm` for the decision and `implement` for production code.
- **Explain or present:** use a diagram for relationships, a chart for measured comparisons, or a portable HTML canvas for a substantial standalone plan, report, notes, or mockup. Use the host's native diagram renderer when it is enough.

State whether the visual is observed evidence, a proposed design, or an illustrative explanation. A generated image or mockup is never evidence that an implementation exists. Ask for missing decision-critical data rather than filling a chart or report with invented values.

## Preserve the visual system

For authored HTML artifacts, keep the existing shared canvas design patterns in [canvas style](references/canvas-style.md) and [the CSS kit](references/kit.css). Study the [plan](examples/plan.html), [report](examples/report.html), or [mockup](examples/mockup.html) example that matches the task. Keep the flat hierarchy, restrained typography, neutral palette, spacing, dark mode, and credits footer. Retain only the kit components the artifact uses.

The kit styles the presentation, not the customer's product. Project UI options should follow the project's own design system unless the user is choosing a new direction. Screenshots and recordings remain faithful to what was observed.

Use one self-contained HTML file for a canvas, with inline styles and no build step. Follow the kit's asset and size constraints. For requested option switching or interaction prototypes, small local scripts may implement the interaction. Keep prototype behavior separate from production and avoid real writes.

## Inspect and deliver

Render every authored artifact and inspect its important states, including narrow layout where relevant. For a long canvas, inspect the top, middle, and bottom. For options, inspect each variant. Fix overflow, clipping, unreadable labels, and broken interactions before presenting it. If rendering is unavailable, report that limit instead of claiming visual QA.

Attach the real screenshot, clip, or file with a concise explanation of what it shows. A local path or an unverified attachment is not delivery. When someone outside this server must open it, follow [publishing](references/publishing.md). Use `verify` to assess whether the captured evidence supports the requested outcome; use `reporting` for analytical claims and `deliver` for completion records and stakeholder communication.

For a requested Notion save, use `documents-operations` for a durable document or `tasks-operations` for task evidence. Use the upload's exact native attachment or embed reference and fetch the saved destination to verify it. Keep private material within its approved audience; do not publish it merely to obtain an embed.

Proof and report canvases contain evidence and the material limits needed to interpret it. Operational follow-ups belong in the owning task, PR, or handoff. Plan canvases may contain actions. Apply `write` and keep the chat shorter than the artifact.
