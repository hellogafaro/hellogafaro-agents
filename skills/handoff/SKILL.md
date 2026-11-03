---
name: |-
  handoff
description: |-
  Transfers, pauses, or resumes unresolved work with its goal, verified state, decisions, evidence, and next action. Use when another owner must continue, when work must stop cleanly mid-task, or when picking up a prior agent's trail without repeating it.
notion_page_id: 3dffc798-2e43-81c3-96a9-fe86a7f896e0
---

# handoff

Make the next owner able to continue from the real state, not reconstruct the conversation.

1. Establish the inherited outcome and exact next action. Use the current request and canonical task, not whichever page happens to be open.
2. Verify the state that affects continuation: accepted decisions, completed work, pending work, blockers, relevant revision, runtime state, and checks already run. Preserve failed approaches only when they prevent repetition or explain a constraint.
3. Collect the required evidence from workers before their workspace is cleaned up, and link the sources and artifacts needed to continue. Return the baseline and final package with each artifact’s provenance, revision or environment, and the claim it supports. A claim without its available supporting artifacts is an incomplete handoff; preserve missing-evidence and accepted-unverified exceptions explicitly. For an agent transfer, list new or revised files with their path, intended filename, type, and purpose when the receiver must collect them. A local path is a collection location, not a durable shared link.
4. State authorization boundaries and material uncertainty. Separate a verified fact from an assumption; keep private information outside the recipient's need out of the handoff.
5. Apply `write`. Open with the inherited action, then use compact prose, headings, or bullets according to complexity. When the user asks for a copyable prompt, put the complete handoff in one text code block. Do not force every handoff into unstructured prose or an overflow file.

Omit time unless an actual entry or unresolved time issue affects continuation. In that case, identify what is already recorded and what still needs confirmation. Never ask a receiving agent to log an inferred duration or duplicate an entry.

The handoff is complete when the next owner can identify what to do, what not to repeat, what evidence to trust, and what permission is still needed. Creating a handoff does not authorize sending it, changing sources, or executing the inherited work.

## Pause safely

Only when the user asks to stop or pause; "keep going" means do not pause.

1. Stop at a safe boundary: finish or back out of the current atomic step, start nothing new, stop nested workers.
2. Take no irreversible action to pause: no PR, push, send, or record change that was not already authorized and underway.
3. Make the work durable where it lives: uncommitted edits as one clear work-in-progress commit on the current branch when commits are authorized, otherwise left in place and named; drafts saved to their destination as drafts.
4. Write the resume note as a handoff to yourself using the steps above, stored with the owning task when one exists.

Reply with where you are in the loop, what is on disk or in records versus still in your head, and the first action on resume. A pause is not a final report.

## Pick up

When resuming your own or another agent's work:

1. Locate the prior trail: the task's journal and comments, the conversation transcript, the branch and its diff against the base, the saved drafts. Read the latest state first, then scan back for decisions. Parse a long trail in a worker and keep the reduced timeline.
2. Reconstruct operational state from the trail, which is authoritative input; do not re-derive it. Diff done against planned and name the resume point.
3. Verify inherited claims against the original goal on the real artifact before building on them. A prior self-report of success is not proof; a prior failure is not proof either.
4. Route the remaining work to the matching mode playbook and continue from the resume point without redoing completed steps.

Reply with where the prior work stopped, what you inherited versus redid, and the resume point.
