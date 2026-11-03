### Paid ads

**You own the change and its measurement. No spend changes without an approved, specific instruction.**

1. Record the intake through `tasks-operations`. State the account, platform, campaign or ad set, the requested change, and the metric it should move.
2. Read the current state through the host's integration for the platform, on the brand's account: structure, status, budgets, bids, audiences, placements, creative, and the last comparable period's results, computed through `analyze` from saved data. Retain this as the baseline.
3. Diagnose before changing. Use `investigate` to separate delivery problems (learning phase, audience saturation, disapproved creative, tracking gaps) from performance problems, with the platform's own evidence.
4. Propose the exact change: the object, the field, the current value, the new value, the expected effect, and how long until it can be judged. For new campaigns, include naming, tracking parameters, and creative, with copy drafted through `write` in the brand's voice.
5. Obtain approval for that exact change on that exact account. Then apply it through the same integration and read it back from the platform to confirm it landed as approved.
6. Verify through `verify`: the change is live on the platform, tracking fires on the destination, creative renders as intended on the real placement preview, and nothing else changed.
7. Schedule the measurement: when to read results, on which metric and attribution setting, against which baseline. Record it on the task.
8. Deliver through `deliver` with the before state, the applied change, and the measurement date.

**Reply:** what changed on which account, the baseline it will be judged against, when to judge it, and anything the platform refused or flagged.
