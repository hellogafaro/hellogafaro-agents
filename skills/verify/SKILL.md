---
name: |-
  verify
description: |-
  Tests the actual artifact against the requested outcome and reports passed, failed, or unverified checks. Use before readiness claims or to check a disputed result.
notion_page_id: 3f2fc798-2e43-811e-a813-cce628d2f4e9
---

# verify

When called by another skill, return the evidence and verdict to that caller. Do not start delivery yourself; route to `deliver` only when the user requests closure.

Prove the requested outcome on the artifact people will use. A clean build, plausible screenshot, or another agent's report is supporting evidence, not a substitute for observing the behavior.

For explicitly rejected results or unexpected evidence contradicting an accepted requirement, outcome, or result already presented to the user, follow [correction routing](references/corrections.md). Expected red tests and disproven implementation hypotheses remain ordinary iteration, not a correction review.

1. Read the request and the project's verification recipe from its canonical context in Notion, or the repository instructions that mirror it. It names how to start the artifact, the real entry point to exercise, what correct looks like, and what evidence to retain. Without one, every behavioral check that depends on it is unverified by default; say so, name the missing recipe, and offer to write it from [project recipes](references/project-recipes.md) after the checks have actually run. Then identify the final revision or artifact, expected observable result, material edge cases, and what must remain unchanged.
2. Select the smallest checks that can disprove correctness. Reuse existing tests and real user paths. For a regression, replay the original failure; for performance, repeat the baseline conditions; for a document or account change, check the source facts and persisted destination.
3. Run the checks against the actual result on the surface people use, driving the browser, terminal, device, or desktop yourself with the host's tools. For a defect, replay the original reproduction on the same surface it was reported on; a pass on a different surface or an "inconclusive" run is not a pass. Inspect side effects as well as visible state. Exercise negative or permission cases when the changed boundary requires them. Respect the owner's scope and authorization; a verification request does not authorize a production transaction.
4. Use `visualize` to gather screenshots, interaction recordings, or comparable before/after evidence when useful. Label the environment and revision. Mockups prove a proposed design, not shipped behavior.
5. Check the request and project standards separately. Use the host's review system where available. For consequential changes, an independent verifier should inspect the artifact and evidence rather than accept the implementer's verdict. Model agreement alone is not proof.
6. Classify each required check as passed, failed, or unverified. A check the user explicitly accepts leaving unrun because of real risk remains unverified by decision, with its reason and substitute evidence; never call it passed. That accepted exception may unblock closure of the agreed scope, without implying full verification. Tie conclusions to the evidence. After another edit, rerun the affected checks and review the final revision before carrying a verdict forward.

Missing access or an unavailable runtime leaves a check unverified. State the exact missing check and the smallest way to resolve it. Never weaken an existing test to manufacture a pass.

For a project without a repeatable verification path, read [verification recipes](references/project-recipes.md). A new recipe is useful only after its own steps have run successfully.

Finish with the outcome, material evidence, and any blocking uncertainty. Proof lives with the owning task or PR when authorized, never only in chat or on a worker's machine; keep the chat short through `write`, and return to the caller; use `deliver` only for requested closure.
