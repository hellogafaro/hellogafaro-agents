# Skill authoring

Define one outcome and its trigger before writing. Search the canonical library for an existing owner; extend a clear owner rather than add overlap.

## Metadata

Use a stable lowercase hyphenated name. Match the directory, frontmatter name, and H1. The description is discovery metadata, not a condensed procedure: state what the skill does, when it applies, and the nearest exclusion only if it prevents ambiguity. Use concrete request terms and neutral third-person wording. Do not list every synonym or name neighboring skills to route around them.

## Body

Open with the outcome, then the steps that change the result. Put required inputs, authority boundaries, observable completion conditions, and missing-input behavior beside the relevant action. Keep general knowledge out. Use a small example only when it resolves a real ambiguity.

Inline what every invocation needs. Move branch-specific detail to directly linked references with an explicit loading condition. Name the owning skill at critical handoffs, with the condition for invoking it and the result needed back; do not copy its procedure. Resolve names through the current registry, not host-specific paths. If a required owner is unavailable, report the gap instead of silently substituting. Use descriptions for optional or unfamiliar capabilities, and local file links for bundled references. Preserve concrete domain and protocol names where removing them would make execution ambiguous.

Cross-skill calls return to the caller unless ownership is explicitly transferred. Do not restart an active caller, replay completed stages, or run the entire workflow for a helper request. Renames must update incoming references as well as the target. Keep model/provider selection and orchestration with the host.

Read project commands, recipients, accounts, and model availability at runtime. Do not bake the authoring host or its defaults into portable procedures. Isolate unavoidable platform commands in conditional adapters. Prefer deterministic scripts for repeatable validation; do not introduce a script solely to claim automation.

## Publish

Validate metadata, links, reference reachability, and scenario behavior through [quality checks](quality-checks.md). Create the skill in the discovered canonical collection and upload the complete directory. Re-download and verify before approved distribution. Preserve provenance and licenses without burdening every invocation with research notes.
