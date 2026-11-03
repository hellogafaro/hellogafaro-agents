# Quality checks

Use the smallest sufficient instructions, not the shortest text at any cost. A shorter prompt is a candidate improvement until behavior is checked.

## Discovery

Test descriptions without bodies first. Include an ordinary request, a paraphrase, a neighboring skill's request, and an ambiguous request. Require selection of the correct capability or a focused clarification. A missing permission is not a reason to choose the wrong skill.

## Execution

Read the selected body and relevant references. Test the happy path, missing data, stale evidence, and a restricted action. Check the observable result, stop condition, and approval boundary. Use examples from actual failures; avoid expanding a prompt with hypothetical edge cases that have not changed behavior.

For delegation, test a small fix, independent bulk work, a tightly coupled change, no suitable cheaper worker, and a worker returning an unsupported success claim. The lead should keep planning and acceptance ownership while bounding worker context and writes.

Run representative cases on the capability tiers intended to use the skills. Compare before and after against a fixed rubric. Repeat ambiguous cases when results vary. Preserve failures and disagreements; model agreement and a text review are not live execution proof. Do not report a perfect score, accuracy gain, token saving, or latency improvement without a defined measurement supporting that claim.

## Structural checks

Check named skill handoffs against the current inventory. Exercise nested calls: verification requesting visual evidence must return a verdict, not recursively start delivery; prose editing must return text, not rerun its caller. Missing named owners must produce an explicit gap, not guessed substitution.

Validate names, descriptions, local links, complete exports, and installations against source hashes. Check that mandatory references are reachable, old names are removed, and model/host names appear only where technically necessary. Compare always-loaded metadata separately from loaded bodies; character or word counts are not measured model-token cost.
