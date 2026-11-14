---
name: |-
  development
description: |-
  Entry point for software work: bug fixes, features, refactors, performance, code investigations, and getting pull requests to green. Use when a request changes or examines code, a repository, a build, or a deployment; the loop skills do the stages.
notion_page_id: 3fffc798-2e43-8172-aecd-fd0dc74f66ae
---

# development

This skill only routes and sequences a software request. The loop skills (`investigate`, `implement`, `verify`, `deliver`, `brainstorm`, `handoff`) do the work, and `tasks` and `documents` keep the records.

## Enter

1. Read the request, the project instructions, and the repository's conventions. Size the intake as below, and find or create the owning task through `tasks` only when that calls for it.
2. Match the request to exactly one playbook. When two fit, take the one whose exit condition the user asked for. When none fits, say so and run the loop stages directly.
3. Before anything else, copy the playbook's numbered steps verbatim into your todo list, then work them in order. A skipped step needs a stated reason in the reply. Never skip a verification step.

| Request | Playbook |
| --- | --- |
| Something is broken, wrong, slow in a way someone noticed, or regressed | [Bug fix](playbooks/bug-fix.md) |
| New or changed behavior, a new screen, endpoint, integration, or option | [Feature](playbooks/feature.md) |
| Same behavior, better structure, dependency upgrade, or migration | [Refactor](playbooks/refactor.md) |
| A measured slowness to improve against a baseline | [Performance](playbooks/performance.md) |
| How does X work, why was Y built this way, is Z safe, read-only | [Investigation](playbooks/investigation.md) |
| Get a PR or stack to green, address review, check CI | [PR follow-up](playbooks/pr-follow-up.md) |

Every playbook that produces a change ends with [git and PRs](references/git-and-prs.md), on using the host's native branch, commit, pull request, and review lifecycle. This skill grants no commit, push, merge, or deployment permission; those come from the user and the project instructions.

## Size the work

Pick the path before the first step and say which one you took. A request moves up a path mid-way when evidence shows it is bigger; it never moves down.

- **Simple.** One clear change or question with a small blast radius, no money moved, no new data collected, and no customer-facing behavior changed. Read only the matching playbook and `verify`, and close through `deliver`. Where a step says "through `investigate`" or "through `implement`", apply its intent (diagnose with evidence, make the smallest change) without opening those skills. Reproduce, change, verify on the surface, report. No task unless one exists or the user asked for one. A replayed reproduction that passes on the same surface is a passed check even without a verification recipe; only the recipe item is reported as unverified.
- **Complex.** Several parts, an unsettled design, dependencies, a customer-facing change, or more than one owner. Run the full playbook with intake, `brainstorm` for real forks, slices, and `deliver`. A change that collects personal data or feeds an audience also states its consent basis in the contract.
- **Data-critical.** The result depends on figures, comparisons, or patterns, or it will move money, budgets, inventory, or audiences by a computed amount. Every number goes through `analyze` before it is stated or acted on, with the script and data retained, and the approval step shows the computed figures. This adds to complex; it does not replace it.

## Size the intake

Intake is one lookup, not a ritual. Use the task the request names. Otherwise, for client or brand work, search Notion once for a task that owns it and attach to it. Accepted or substantial client or brand work with no task gets one created before the first change. Other work needs no task unless the user asks, as `AGENTS.md` says. Either way, close through `deliver`, which reconciles any task and ends with the close-out list.

## Verify on the real surface

A change is proven when the agent observes the original symptom or requested behavior on the surface people use: the browser for web, the terminal for a CLI, the running service for an API, the device for mobile. Checking a deployed result afterwards needs its own authorization. Platform- or hardware-dependent behavior is proven only on that target; a Linux or browser run does not prove macOS or device behavior. `verify` owns this step and reads the project's verification recipe first. With no recipe, it records the check as unverified and names the missing recipe instead of improvising a pass.

## Reply

Lead with the result and its proof, then the decisions that shaped it, then what remains. Paste failing-then-passing output or link the retained evidence instead of describing it. Keep the detailed proof with the task or pull request through `deliver`.
