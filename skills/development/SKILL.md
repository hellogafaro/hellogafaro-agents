---
name: |-
  development
description: |-
  Entry point for software work: bug fixes, features, refactors, performance, code investigations, and getting pull requests to green. Use when a request changes or examines code, a repository, a build, or a deployment; the loop skills do the stages.
notion_page_id: 3fffc798-2e43-8172-aecd-fd0dc74f66ae
---

# development

Turn a software request into a sequenced, verified, delivered change. This skill only routes and sequences; the loop skills (`investigate`, `implement`, `verify`, `deliver`, `brainstorm`, `handoff`) do the work, and the operations skills (`tasks-operations`, `documents-operations`) keep the records.

## Enter

1. Read the request, the project instructions, and the repository's own conventions. Size the intake as described below and find or create the owning task through `tasks-operations` only when that calls for it.
2. Match the request to exactly one playbook below. When two fit, take the one whose exit condition the user actually asked for. When none fits, say so and fall back to the loop stages directly.
3. Copy the playbook's numbered steps verbatim into your todo list before doing anything else, then work them in order. A step you skip needs a stated reason in the reply; a verification step is never skipped.

| Request | Playbook |
| --- | --- |
| Something is broken, wrong, slow in a way someone noticed, or regressed | [Bug fix](playbooks/bug-fix.md) |
| New or changed behavior, a new screen, endpoint, integration, or option | [Feature](playbooks/feature.md) |
| Same behavior, better structure, dependency upgrade, or migration | [Refactor](playbooks/refactor.md) |
| A measured slowness to improve against a baseline | [Performance](playbooks/performance.md) |
| How does X work, why was Y built this way, is Z safe, read-only | [Investigation](playbooks/investigation.md) |
| Get a PR or stack to green, address review, check CI | [PR babysit](playbooks/pr-babysit.md) |

Every playbook that produces a change ends with [git and PRs](references/git-and-prs.md), which says how to use the host's native branch, commit, pull request, and review lifecycle well. This skill grants no commit, push, merge, or deployment permission; those come from the user and the project instructions.

## Size the work

Decide the path before the first step and say which one you took.

- **Simple**: one clear change or question with a small blast radius, no money moved, no new data collected, and no customer-facing behavior changed. Read only the matching playbook and `verify`, and close through `deliver`. Where a playbook step says "through `investigate`" or "through `implement`", apply the step's intent (diagnose with evidence, make the smallest change) without opening those skills. Reproduce, change, verify on the surface, report. No task unless one exists or the user asked for one. A replayed reproduction that passes on the same surface is a passed check even when the project has no verification recipe; the recipe item alone is reported as unverified.
- **Complex**: several parts, an unsettled design, dependencies, a customer-facing change, or more than one owner. Run the full playbook with intake, `brainstorm` for real forks, slices, and `deliver`. A change that collects personal data or feeds an audience also needs the consent basis stated in the contract.
- **Data-critical**: the result depends on figures, comparisons, or patterns, or it will move money, budgets, inventory, or audiences by a computed amount. Every number goes through `analyze` before it is stated or acted on, with the script and data retained, and the approval step shows the computed figures. Data-critical adds to complex; it does not replace it.

A request can move up a path mid-way when evidence shows it is bigger than it looked; it never moves down.

## Size the intake

Intake is one lookup, not a ritual. When the request names a task, use it. Otherwise, for client or brand work, search Notion once for a task that already owns it and attach to it; accepted or substantial client or brand work with none gets its task created before the first change. Personal internal tooling, quick work not clearly owned by a client or brand, questions, tentative ideas, read-only analysis, and small clear changes nobody asked to record need no task unless the user asks for one; the reply says the work ran without one. At the end, close through `deliver` either way: it reconciles the task when one exists, and always retains the proof, cleans up what the work created, and ends with the close-out list.

## Verify on the real surface

A change is proven when the agent observes its original symptom or requested behavior on the surface people use: the browser for web, the terminal for a CLI, the running service for an API, the device for mobile. Development tests run in the agent's own isolated build, not the shared live service or the user's active desktop; checking a deployed result afterwards needs its own authorization. Behavior that depends on a platform or hardware is proven only on that target; a Linux or browser run does not prove macOS or device behavior. A clean build, passing unit tests, or a plausible screenshot support the proof; they do not replace it. `verify` owns this step and reads the project's verification recipe first; when the project has none, record the check as unverified and name the missing recipe rather than improvising a pass.

## Reply

Lead with the result and the evidence that proves it, then the decisions that shaped it, then what remains. Paste failing-then-passing output or link the retained evidence rather than describing it. Keep the detailed proof with the task or pull request through `deliver`.
