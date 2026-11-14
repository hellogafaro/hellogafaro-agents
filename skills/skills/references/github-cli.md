# GitHub mirror and installation

## Mirror rules

Notion is canonical. The GitHub repository is generated from Notion and provides backup history and distribution. Never edit a generated skill in GitHub. If the mirror differs from Notion, inspect the sync job and rerun it after approval.

## Canonical project layout

```text
project/
└── .agents/
    └── skills/
```

Install an explicit project skill from the generated mirror:

```bash
gh skill install OWNER/REPOSITORY SKILL --dir .agents/skills
```

Use an explicit skill list for curated projects. Do not use `--all` when the project intentionally carries only a subset. Shared installations belong in the host's discovered shared directory, not duplicated provider-specific directories.

## Inspect and update

```bash
gh skill list --dir .agents/skills --json skillName,sourceURL,scope,version,pinned,path
gh skill update --dir .agents/skills --dry-run
gh skill update --dir .agents/skills --all
```

Run the dry run first. Review the resulting Git diff after applying updates. Pinned skills do not update until deliberately unpinned.

## Update lifecycle

After Notion changes:

1. Download and validate the Notion skill.
2. Let the configured sync generate the GitHub change.
3. Inspect the generated diff and commit status.
4. Run installation update checks.
5. Apply approved updates and verify runtime discovery.

Do not run legacy copy-based deployment after GitHub CLI installation. It removes provenance metadata and recreates duplicate trees.
