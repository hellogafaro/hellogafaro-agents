### Feature

**You own the design and the proof. Build one end-to-end case first.**

1. Record the intake through `tasks-operations` when this is accepted work. State the observable outcome, the constraints, and what must remain unchanged.
2. Resolve facts before asking questions: read the affected flow, run the current behavior, check the project's conventions and existing capabilities. Use `investigate` in Explain mode for an unfamiliar subsystem.
3. Settle genuine product or design forks through `brainstorm` with concrete options; settle empirical forks by prototyping and observing, with `visualize` when seeing the alternatives decides it. Do not ask the user a question an experiment can answer.
4. Write the contract through `implement`: the data shape, the caller behavior, the slices in the fewest independently verifiable outcomes, and the final checks each slice must pass. A slice exercises a narrow end-to-end path, not a disconnected layer.
5. Decide delegation. Independent slices in disjoint files may run as parallel workers; coupled slices stay with one owner. Each worker gets file paths, the named data shape, success criteria, and the obligation to return baseline and final evidence, not a success claim.
6. Implement the first end-to-end case, prove it through the public interface on the real surface, then add the remaining accepted cases. Keep a tested slice working before starting the next.
7. Verify through `verify` against the request and the project standards separately, on the surface people will use, with the project's verification recipe. Collect every worker's evidence before its machine is cleaned up.
8. Follow [git and PRs](../references/git-and-prs.md): small ordered commits, a stack when the change has layers reviewers should see alone, a PR body with the behavior and its proof.
9. Close through `deliver` when closure is authorized; otherwise return readiness, open decisions, and risk.

**Reply:** what you built, the contract you chose and the alternatives you rejected, the evidence, and the open decisions. Use a table for design alternatives.
