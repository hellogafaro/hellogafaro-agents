# Hello Gafaro skills

Generated backup of Hello Gafaro's first-party Notion Skills.

Notion is the source of truth. Do not edit skill content in this repository. Each
`notion_page_id` identifies the canonical Notion page from which the directory
was exported.

## Distribution

- BB shared installations live in its user skill directory.
- Project-specific installations live once in `.agents/skills`.
- Provider-specific copies are not maintained.
- Third-party and BB plugin skills remain with their upstream owners and are not
  mirrored here.

The repository is a backup and distribution snapshot. It is not required for BB
to use skills exported directly from Notion.

## Synchronization

The `Sync Notion skills` GitHub Action runs daily at 03:17 UTC and can also be started
manually. It signs in to EU Infisical with GitHub OIDC through the
`github-hellogafaro-skills-sync` machine identity, reads only
`NOTION_ACCESS_TOKEN` from the root of the `hellogafaro-studio` project (`prod`),
downloads every page in the configured Notion Skills data source, validates the
exports, and commits only real changes.

The machine identity only accepts OIDC tokens from this repository's `main`
branch and the `Sync Notion skills` workflow, so no Infisical secret is stored in
GitHub.

The workflow requires these repository variables:

- `INFISICAL_IDENTITY_ID`
- `NOTION_SKILLS_DATA_SOURCE_ID`

## Pull request review

`.github/workflows/pr-review.yml` is a reusable reviewer that replaces the Capy
"PR review" automations. Each repository calls it from a copy of
`.github/workflows/pr-review-caller.yml` (with `uses:` pointing at
`hellogafaro/hellogafaro-skills/.github/workflows/pr-review.yml@main`). The prompt is
`.github/pr-review/prompt.md`. It keeps Capy's `pr-review` commit status and review
markers, so a commit is reviewed once and re-reviews continue from the last one.

With `post: false` (shadow) the job token is read-only and the review only goes to
the job summary. It reads `ANTHROPIC_API_KEY` from the `hellogafaro-studio` project
(`prod`) in EU Infisical through GitHub OIDC, using the machine identity in the
`PR_REVIEW_INFISICAL_IDENTITY_ID` variable. That identity should accept only tokens
whose `job_workflow_ref` is this repository's `pr-review.yml` on `main`.

## Structure

- `skills/` contains the complete Notion exports, including supporting files.
- `tests/` validates the exported inventory and portable content.

## Rules

- Change a skill in Notion, then refresh this generated snapshot.
- Never sync edits from GitHub back into Notion.
- Keep lowercase hyphen skill IDs and trigger-first descriptions.
- Do not add removed legacy skills.
