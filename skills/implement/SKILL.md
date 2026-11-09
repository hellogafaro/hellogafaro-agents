---
name: |-
  implement
description: |-
  Makes an authorized change to code, content, configuration, a campaign, or a record with the smallest verifiable edit, from contract to proof. Use when something must be built, fixed, or changed, not for diagnosis-only requests or unresolved product decisions.
notion_page_id: 3eafc798-2e43-8154-b79b-e8662788ed3c
---

# implement

Implement the accepted outcome with the smallest understandable change, whether the artifact is code, a document, a configuration, a campaign, or a record. Read the affected flow before choosing a solution. The surrounding project, not a universal stack, determines the commands and conventions. When a playbook routed here, that playbook owns the sequence; this skill owns how each change is contracted, made, and proven.

## Establish the contract

1. Read the request, project instructions, owning task, and relevant code. Identify the observable outcome, constraints, dependencies, and what must remain unchanged. Use `tasks-operations` for the work record when the work has or needs a task.
2. Resolve observable facts yourself. Use `brainstorm` only for a product or design decision the evidence cannot settle. An investigation request does not authorize implementation.
3. Name the data shape, caller behavior, and verification before editing. Reuse the project's established pattern. For a consequential choice with no clear precedent, compare distinct sketches or prototypes through `visualize` before committing to a shape.
4. For multi-part work, split into the fewest independently verifiable outcomes. Record only genuine blocking dependencies. Feature slices should exercise a narrow end-to-end path, not leave disconnected database, API, and UI tasks. Use compatible expand, migrate, contract steps when a wide migration cannot land safely at once.

The contract is ready when each slice has an observable result and a feasible check. Keep a small request small; do not manufacture a specification or task for every code edit.

Before changing the artifact, identify the claims and smallest final checks, capture the relevant baseline or reproduction, and select an evidence location. Confirm that the checks and intended publication are feasible within available access and authority. Save useful check output when it runs rather than reconstructing it from chat at closure. Follow `visualize` for screenshots, recordings, or comparisons. Retain meaningful checkpoints and final proof through cleanup; do not collect every tool action or fabricate a missing baseline.

## Choose the smallest solution

Ask in order: is the change needed; does the codebase already do it; can the standard library, native platform, or an installed dependency do it; what is the smallest clear implementation left? A native control is suitable only when it meets the actual UX and accessibility requirements.

Preserve trust-boundary validation, security, error handling, data integrity, and accessibility. Small means less unnecessary machinery, not compressed code. For repetitive changes, prove one unit and use a rerunnable script or codemod when that makes the rest safer.

## Execute and prove

Work one verifiable slice at a time, following the active playbook's shape for the change when one exists. Use the host's orchestration for independent work and its native Git and PR lifecycle when authorized; this skill grants no commit, push, merge, or deployment permission.

Run `verify` against the final artifact and requested outcome, not just the diff. Review both conformance to project standards and conformance to the request. Prefer the host's existing review mechanism over a duplicate review stack. Investigate findings before acting on them.

Implementation is ready when the accepted behavior is demonstrated, relevant checks cover the final revision, blocking findings are resolved, and the required baseline, decisive failures, and final proof have been collected from any workers. Files left only on a worker machine are not a completed evidence handoff. If access prevents proof, report the missing check as unverified. When a playbook or another skill called this one, return the implementation, evidence, and readiness state to it. When this is the top-level work, pass it to `deliver`, which closes it without being asked; merges, deployments, and other gated actions keep their own approvals. Use `handoff` when another owner must continue unfinished work.
