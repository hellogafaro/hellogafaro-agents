### PR follow-up

**You own the pull request until it merges, is held for a human, or closes. You fix; Tug merges.**

1. Declare the mode before touching anything. `drive` works the loop until the PR merges or is held ("get it green", "follow up on this"). `threads` answers review comments and changes nothing else ("address the review"). `check` is one status pass and a report ("is it green", "check on X"). Undeclared defaults to `drive`; a small or docs-only PR gets `check`, unless you opened it, which always gets `drive`.
2. In `drive`, run the PR's watch as a background command, so its exit wakes you, then end your turn. Run one watch per PR, and never poll or add a sleep loop:

   ```bash
   npx -y github:g4f4r0/tug#main pr watch OWNER/REPO#N --until-merged
   ```

   It stays quiet while the PR is pending or ready, then prints the PR's state as JSON once and exits: `0` merged, `2` conflicts, `3` review threads, `4` failed checks, `5` timeout after an hour, `6` held (`needs:human` or `merge:hold`) or closed, `7` GitHub could not be read. It uses `GITHUB_TOKEN`, `GH_TOKEN` or `gh auth token`.

3. When the watch exits, start from the JSON it printed: `failed` names the failing checks and `threads` counts the open threads. Read only the failed jobs' logs and the unresolved threads, never the whole PR again. After each push, start the watch again. On `5`, start it once more; on `7`, check `gh auth status` and start it once more.
4. Order is conflicts, then review threads, then CI. Merge the base in to resolve a mechanical conflict. Report a conflict that needs a product or design call, and add `needs:human`. Batch every known fix into one push.
5. Triage every finding and comment on its merits against the current diff: fix it (failing test first when cheap), dismiss it with a concrete reason, or ask. Reply in the thread and resolve each decided thread. Never post a plain PR comment.
6. For a failing check, read the failed job's log, reproduce locally when feasible, and fix the cause. Rerun a check once, only when the log shows a flake. A second identical failure is real. Never edit unrelated tests or CI configuration to get green.
7. Cap the loop. After 3 exits without progress (the same failure or thread again), add `needs:human`, stop watching, and say what blocks it in your reply.
8. Never merge. Where `tug.json` has `merge`, Tug's `merge` check merges a PR the review says is safe once its head is ready, or holds it with `needs:human`. If you resolved threads without pushing, re-run that run's merge job, as [git and PRs](../references/git-and-prs.md) says. Elsewhere, merging follows "Merges and releases" in [git and PRs](../references/git-and-prs.md).
9. On `0` (merged) or `6` (held or closed), stop watching. Clean up through `deliver` and reply with the result. For a held PR, name what holds it.

**Reply:** the mode, the PR's state before and after, what you fixed, what you dismissed and why, and the one thing that still needs a human.
