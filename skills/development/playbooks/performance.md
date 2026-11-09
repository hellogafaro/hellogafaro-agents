### Performance

**You own the measurement. No number without a baseline and a repeatable method.**

1. Record the intake, with a task through `tasks-operations` only when the intake rule in `development` calls for one. State the metric, the target, and the real workload or user path it is measured on.
2. Capture the baseline on the real workload. Record environment, input, metric, repetitions, and variance, with the statistics computed through `analyze` from the retained raw output, never read off a single run.
3. Trace before theorizing: profile, time, or instrument where the time or memory actually goes. Use `investigate` to rule out candidate causes with evidence.
4. Change one thing. Repeat the identical measurement. Keep the change only if the metric moved beyond the variance; revert it otherwise and record what it ruled out.
5. Confirm correctness was not traded away: existing checks pass and the measured work is the intended work, not skipped work.
6. Verify through `verify`: the before and after measurements on the same conditions, with the project's verification recipe for the affected path.
7. Follow [git and PRs](../references/git-and-prs.md): the PR body carries the measured result and its limits, never a projected speedup.
8. Close through `deliver`, reporting readiness.

**Reply:** baseline, final measurement, method, what changed, what was tried and reverted, and the limits of the measurement.
