---
name: |-
  skills
description: |-
  Authors, audits, renames, and distributes reusable agent skills from their canonical library. Use for skill lifecycle changes, discovery quality, or installation drift, not ordinary task documentation.
notion_page_id: 3dffc798-2e43-8172-a39e-f785e74575fe
---

# skills

Keep source authoring, generated mirrors, and runtime installations distinct. Use the configured canonical library; installed copies are not editable sources.

1. Search before creating. Download the complete current skill and relevant references. Compare consumers and installed copies before diagnosing drift. Read [source prerequisites](references/prerequisites.md).
2. Follow the requested branch: [creation and authoring](references/creation.md), [updates](references/updating.md), or [rename and removal](references/management.md). Preserve clear trigger boundaries, safety constraints, and required assets.
3. Validate structure and behavior separately. Read [quality checks](references/quality-checks.md) for descriptions, progressive disclosure, routing cases, and evidence standards.
4. Publish to the canonical source only within authorization. Download again and compare the full body and file set; review normalization instead of assuming a successful upload proves fidelity.
5. Refresh only approved installations and mirrors with their actual adapter, loading only the applicable reference: [filesystem installation](references/filesystem-installation.md) or [repository distribution](references/github-cli.md). It holds the necessary platform details. For failure or legacy copies, use [recovery](references/migration-troubleshooting.md).

Keep mutable IDs, accounts, model choices, credentials, and destinations in runtime configuration. Name skill owners at critical handoffs instead of copying their procedures; use descriptions to discover optional capabilities. Never infer deletion or public-sharing permission from a rename or refresh.

Finish when canonical exports match the intended change, approved installations are verified, superseded names no longer route, and mirror state is known. Report remaining gaps, and distinguish static checks, scenario evaluation, and live execution. Existing sessions may keep an earlier skill registry.
