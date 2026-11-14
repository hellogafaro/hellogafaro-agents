# Hello Gafaro skills

A read-only copy of Hello Gafaro's Notion Skills library. Notion is the source
of truth: change a skill there, never here. Agents on g4f4r0-server install
skills straight from Notion with Notion Code (`ntncode sync`), not from this
repository.

## Layout

- `skills/` holds every skill exactly as Notion exports it, supporting files
  included. Each `SKILL.md` has a `notion_page_id` that points to its page.
- `notion.json` holds the Skills data source ID.
- `scripts/sync-notion-skills.mjs` is the exporter.
- `tests/` checks the export.

A skill with `Auto-invoke` unticked in Notion gets
`disable-model-invocation: true` in its `SKILL.md`. A skill removed or trashed
in Notion disappears from `skills/` on the next sync.

## Sync

The `Sync Notion skills` workflow runs at 03:17, 09:17, 15:17 and 21:17 UTC
and on demand. It signs in to EU Infisical with GitHub OIDC through the
`github-hellogafaro-skills-sync` machine identity, reads only
`NOTION_ACCESS_TOKEN`, exports every skill, runs `npm run check`, and commits
only real changes. An empty or broken export fails the run and commits nothing.

The machine identity only accepts OIDC tokens from this repository's `main`
branch, so no secret is stored in GitHub. The workflow needs the repository
variable `INFISICAL_IDENTITY_ID`.

Run it now:

```bash
gh workflow run "Sync Notion skills" --repo hellogafaro/hellogafaro-skills
```
