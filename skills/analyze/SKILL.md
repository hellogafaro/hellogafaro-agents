---
name: |-
  analyze
description: |-
  Computes every number from retained data with code, reconciles sources, and finds the segments, trends, and outliers that explain a change. Use whenever a result depends on figures, comparisons, rates, or patterns in data, before any of them is stated or acted on.
notion_page_id: 400fc798-2e43-81df-b953-c300e5587965
---

# analyze

Return computed figures, the script that produced them, and the patterns they show to the calling stage. Do not interpret for a reader; `reporting` does that. Do not act on a finding; the owning playbook does.

## Rules

- No arithmetic in prose. Every figure, delta, rate, and ranking comes from code run over the retained data: a script in the project's language or Python, or a SQL query. Mental math, estimates from a glance at a payload, and counting items in context by eye are not results; if one slipped into a draft, recompute it before it is stated.
- Retain the inputs. Save the raw responses or exports to files before computing, with source, account, endpoint, parameters, and date window recorded beside them. Compute from the files, not from what is visible in context. Reduce a large payload in the script, never by reading part of it and extrapolating.
- Reconcile before comparing. Check units, currency, time zone, date boundaries, attribution and deduplication rules, and coverage for every series; align them in code and name every mismatch that survives. Totals must tie: a sum of parts equals the reported total, or the difference is explained.
- Check the result. Recompute a key figure a second way, confirm row counts and date ranges match the request, and look at the extremes of each series for broken data (zeros, duplicates, spikes from backfills). A figure that fails a check is not reported.
- Compute the patterns, do not guess them. Break the change down by the dimensions that could carry it (segment, product, channel, campaign, geography, device, day) and rank by contribution. Compare the period to the same length before it and to a year earlier when seasonality may apply. Flag outliers against a stated baseline and variance, and separate a trend from a one-off. Correlation is a lead for `investigate`, not a cause.
- Scale the method to the stakes. A quick read of two numbers still runs through code, but needs no decomposition. A decision that moves money, inventory, or a customer-facing change gets the full reconciliation and second-way check, and its script is retained with the task.

## Steps

1. State the question as a computation: the metric definitions, the periods, the dimensions, and the comparison. Resolve ambiguity by reading the sources, not by assuming.
2. Pull the data through the owning operations skill and save it to files with provenance.
3. Write and run the script. Print the figures with their units, the row counts, and the date range actually covered.
4. Run the checks. Fix the script, not the numbers, when something does not tie.
5. Decompose and rank contributions; compute baselines, variance, and outliers.
6. Return the figures, the checks that passed or failed, the patterns with their contribution, the gaps the data cannot answer, and the path of the script and data files, so `verify` can rerun them and `reporting` can interpret them.
