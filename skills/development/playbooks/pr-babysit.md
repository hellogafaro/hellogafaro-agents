### PR babysit

**You own the merge frontier. Declare a mode, clear one pull request at a time, stop where the human's call begins.**

1. Declare the mode before touching anything. `drive` works the loop to merge-ready ("get it green", "babysit this"). `threads` answers review comments and changes nothing else ("address the review"). `check` is one status pass and a report ("is it green", "check on X"). Undeclared defaults to `drive`; a small or docs-only PR gets `check`.
2. Read the current state: the pull request overview, the failing checks only, and the open review threads, through the host's pull request tooling or the GitHub CLI. Confirm nothing else is already babysitting the same PR or stack.
3. Work the lowest unmerged PR only. In a stack, upstack threads are read and batched, never fixed at the cost of restarting the frontier's checks.
4. Order is conflicts, then review threads, then CI. A conflict is reported with the branch that needs the merge or rebase, not silently resolved inside a babysit unless the user asked for that. Batch every known fix into one push.
5. Triage every review finding and external comment on its merits against the current diff: fix, dismiss with a concrete reason, or ask. Resolve each addressed thread with its disposition; never leave a decided thread open.
6. For a failing check, read the failed job log, reproduce locally when feasible, and fix the cause; rerun a flaky check at most once before treating it as real.
7. After each push, wait for CI and review results at a sensible interval rather than polling tightly. Rerun `verify` on the final head when the fix changed behavior.
8. Stop at merge-ready. Merging, enabling auto-merge, and releasing need the user's explicit request in the current conversation.

**Reply:** the mode, each PR's state before and after, what you fixed, what you dismissed and why, and the one thing that still needs a human.
