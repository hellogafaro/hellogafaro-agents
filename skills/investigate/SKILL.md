---
name: |-
  investigate
description: |-
  Explains how something works, diagnoses what is wrong, and traces why a decision was made, from evidence, across systems, accounts, campaigns, and records. Use for how or why questions about anything the organization already runs, not broad public research or unrequested fixes.
notion_page_id: 3eafc798-2e43-81c7-b1fa-fbfa2bb398e3
---

# investigate

Three questions, one discipline: collect the evidence first, then see what story it supports.

| Question | Mode |
| --- | --- |
| How does it work? | Explain |
| What is wrong, or why does it fail? | Diagnose |
| Why is it this way, or why did we decide that? | Trace the decision |

## Evidence rules

- Before collecting, identify the evidence that could decide the question. Own and retain the reproduction, decisive failed checks, and final confirmation, then return them with the finding. Use `visualize` for visual packaging; persist to a task only when one owns the accepted work.
- Look at the real thing. Run it, open it, query it, read the live value. Code shape, summaries, and reports are leads, not proof.
- Cite every claim: file and line, commit, task, email, message, metric with its date range, screenshot path. What you can't cite is inference. Label it.
- Hedge on purpose. Say "because" only for direct evidence and "likely" or "appears to" for indirect evidence.
- Keep more than one explanation alive until evidence rules it out. Before concluding, ask what you would see if another explanation were true, and look for it.
- Show contradictions between sources. Don't pick the one that fits.
- Name the gaps: what you searched and didn't find. "We couldn't find out" beats a confident guess.
- Send large payloads (logs, traces, exports, long threads) to a child or a script and keep only the reduced finding.

## Explain

1. Size the question. Narrow: read and explain in one pass. Broad: split it into parts, explore them in parallel children, then combine.
2. Trace the flow from trigger to outcome: what starts it, each step, where data goes, the decision points.
3. Answer the question first, then include only the flow, source pointers, and caveats needed to understand it.
4. For "are we sure?" or "is this right?", add a critique sorted into fix now, worth considering, noted, and dismissed with the reason.

## Diagnose

Stay within the authorized environment and change scope. Prefer existing logs and read-only observation. Temporary local instrumentation is appropriate only when local diagnostic edits are allowed; preserve unrelated work, avoid secrets, and remove only the instrumentation this run added. Changing production logging, data, or configuration needs explicit authorization. If instrumentation is not allowed, report the evidence gap rather than treating diagnosis as permission to write.

1. Reproduce the symptom yourself where it happens. If it won't reproduce, narrow the conditions or add logging until it does. If you truly can't, say what you tried and what blocked you.
2. Capture the signal before theorizing: the exact error, logs, a trace, the metric before and after, a screenshot.
3. List the hypotheses. Rule them out with evidence, each time running the check that eliminates the most. Don't guess; add instrumentation.
4. After a restart, update, or settings change, suspect state and recent changes first: caches, profiles, credentials, settings, and what changed when.
5. Keep asking why until you reach the cause. A guard that hides the symptom is not a fix.
6. Confirm the mechanism: predict something from it and check that it happens.
7. Look for the same pattern elsewhere within your scope.

Report the symptom, how you reproduced it, the root cause with evidence, what you ruled out, the fix or recommended fix, and how to verify it. Diagnose only unless asked to fix. The fix belongs to the owning agent.

## Trace the decision

1. Anchor on the exact thing (lines of code, a setting, a campaign, a task) and when it last changed: git blame and log, change history, task dates.
2. Search relevant source categories near the change: revision history, work records, decisions, communication, and operational logs. Expand only when evidence leaves a material gap. Delegate independent bounded searches when their benefit exceeds coordination cost, not one worker per available system.
3. Defensive-looking things (retries, limits, flags, guards, exclusions) often trace to an incident. Search near the change date.
4. Don't infer intent from shape. Something that makes sense today may exist for a reason that no longer applies, or for no reason.

Report the decision, each reason with its citation, competing explanations, and the gaps.
