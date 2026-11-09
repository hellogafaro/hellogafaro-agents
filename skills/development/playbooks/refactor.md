### Refactor

**You own behavior preservation. Pin first, move second.**

1. Record the intake, with a task through `tasks-operations` only when the intake rule in `development` calls for one. State what must behave identically afterwards and what improvement justifies the change.
2. Pin the current behavior: characterization tests, representative outputs, or an equivalence script run on the real surface and retained as the baseline. Without a pin, stop and build one before touching structure.
3. Plan structural steps that each keep the pin green. For a dependency upgrade or migration, use compatible expand, migrate, contract steps when the whole change cannot land safely at once, and name the removal condition for any temporary compatibility.
4. Implement through `implement`, one step at a time, re-running the pin after each. Keep unrelated bugs and feature requests out; record them for their own task.
5. Remove obsolete APIs after their callers migrate, and delete rather than keep dead code.
6. Verify through `verify`: the pin still passes on the final revision, the improvement is observable, and the project's verification recipe passes. A refactor that changed behavior is a failed check, not a bonus.
7. Follow [git and PRs](../references/git-and-prs.md): one logical step per commit, mechanical moves separated from semantic edits so review can trust each.
8. Close through `deliver`, reporting readiness.

**Reply:** what moved, the pin and its result before and after, what was removed, and any deferred follow-ups with their task.
