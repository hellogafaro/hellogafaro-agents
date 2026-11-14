# Management

## Rename

Treat a rename as one atomic migration:

1. Rename the canonical Notion skill.
2. Update its exported name, H1, references, and routing instructions.
3. Remove or migrate every old installed name.
4. Install the new name and verify agents discover only the replacement.
5. Search again for the old name before completion.

Never leave both names installed unless the user explicitly requests a compatibility period.

## Remove

Confirm the skill is not referenced by another skill, project instruction, script, test, or installation manifest. Remove its Skill designation in Notion, then remove approved generated and installed copies. Do not delete local or remote state without explicit approval.

## Review

Check trigger specificity, overlap, structure, source ownership, mutable configuration, safety rules, reference depth, deterministic scripts, and installation provenance. Recommend consolidation when two skills own the same workflow.

## Distribution policy

- First-party source lives in Notion.
- GitHub is a generated backup and distribution mirror.
- Project installations live once in `.agents/skills` and are committed when the project must work from a fresh clone.
- Shared skills use the approved user or organization scope. Discover its path rather than copying another host layout. Follow [the filesystem adapter](filesystem-installation.md) where applicable and keep provenance outside skill folders.
- Project-specific skills stay project-scoped to avoid routing noise and accidental cross-project behavior.
- Third-party, plugin, and system skills remain owned by their upstream source and do not move into Notion or get replaced by first-party refreshes. Plugin-supplied skills, such as `notion-skill-updater`, are not edited; edits to our skills go through this skill.
- Axo owns skill edits and distribution. Other bots report skill issues to Axo.
