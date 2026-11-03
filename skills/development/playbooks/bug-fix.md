### Bug fix

**You own the diagnosis. Every shipped line traces to runtime evidence.** A change that "might help" is a hypothesis, not a fix; when evidence refutes a hypothesis, revert what it motivated. Ship the smallest change the evidence justifies.

1. Record the intake. Find or create the owning task through `tasks-operations` when this is accepted work. Capture the reported symptom, surface, and environment exactly as reported.
2. Reproduce it yourself on the same surface, using the browser, terminal, or computer-use tools the artifact needs. Ask the user to reproduce only with a specific reason the surface is unreachable, and only after driving it as far as it goes. If it will not reproduce, narrow conditions or add local instrumentation until it does, within the authorized change scope. Retain the failing output or screenshot as the baseline.
3. Diagnose through `investigate` in Diagnose mode: list hypotheses, run the check that eliminates the most, confirm the mechanism by predicting something from it and observing it. Look for the same pattern elsewhere in scope.
4. Decide the fix shape through `implement`'s contract: the smallest change at the cause, not a guard that hides the symptom. Use `brainstorm` only for a product call the evidence cannot settle; a question you could answer by running something is yours to answer.
5. When a cheap local test exists, write it so it fails for the intended reason before the fix and passes after; otherwise keep the runtime reproduction and state the test limitation. Never weaken or delete an existing test to pass.
6. Implement through `implement`, one verifiable slice at a time.
7. Verify through `verify` on the same surface as step 2: the original reproduction now passes, side effects are inspected, and the project's verification recipe has been run. "Inconclusive" or wrong-surface is not a pass; report it as failed or unverified.
8. Follow [git and PRs](../references/git-and-prs.md): failing test before fix in history where applicable, a PR body that shows the before and after.
9. Close through `deliver` when closure is authorized; otherwise return readiness and remaining risk. Use `handoff` if another owner continues.

**Reply:** what was broken, root cause with its citation, the fix, how it was verified with the failing-then-passing evidence, and anything ruled out that a reader might otherwise suspect.
