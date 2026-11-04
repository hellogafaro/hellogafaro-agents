# Filesystem installation and refresh

Notion is the first-party authoring source. A filesystem installation in the host's shared skills directory is a runtime copy, not an editable source or a GitHub checkout. Refresh is on demand; this workflow does not create or enable an automation.

## Resolve and download

1. Search the live Notion Skills library. Fetch its data source schema, then query all rows using the returned collection URL and exact property names. Verify that the result is complete rather than using search snippets as an inventory.
2. Confirm the approved installation scope, skill list, and exclusions. For a host whose own Git and pull request workflow is native, exclude `git-operations`; the host already owns that work, and the `development` mode's git reference says how to use it. Do not archive or delete its Notion source as part of an installation. Do not add legacy-only skills absent from Notion. The library's `Tags` property classifies each skill as Mode (`development`, `marketing`, `support`), Loop (the shared stages), Operations (tools the loop calls), or Meta; an installation normally takes every Mode, Loop, and Operations skill plus `skills-management`, and a skill without a tag needs a classification decision before it is installed.
3. Call `tools.notion.api.agentSkills.getSkillDirectory` through the Executor Notion connection labeled "Hello Gafaro" for every selected page, then fetch the returned URL. Save the complete tar.gz bytes under a scratch directory outside any installation; keep supporting files and nested directories. Record the returned page ID and version ID. Download URLs are temporary: obtain fresh ones when needed and never save them in provenance or reports.
4. Build an unsigned JSON plan under that scratch directory with `skills` records containing `name`, `page_id`, `version_id`, and the local `archive` path, plus an `excluded` name list. Source identifiers belong in this external configuration, not in reusable instructions. Do not add unapproved new names automatically when the source inventory changes.

## Validate and install

Use Python 3.9 or newer with PyYAML and the installer in this skill's `scripts/sync_skills.py`. Pass the approved shared `skills` destination and a manifest path outside its skill folders, such as `tooling/skill-sync/manifest.json` beside that destination. There is no host skill installation CLI to invent.

Run the installed script with the local plan and explicit paths:

```text
python3 <skills-management-directory>/scripts/sync_skills.py <scratch-plan.json> --destination <approved-drive>/skills --manifest <approved-drive>/tooling/skill-sync/manifest.json
```

The default run validates without replacing anything. Review the selected names, complete files, source versions, and any differences from the current manifest. Preserve unexpected local edits in scratch and stop for a decision rather than overwriting them. After installation approval, rerun the same command with `--apply`.

The installer stages every selected archive before changing any installed skill. It rejects traversal, links, special entries, duplicate paths, invalid names or frontmatter, missing local references, and oversized archives. Reference ZIP attachments from Notion are validated, unpacked into `references/`, and retained unchanged; other ZIP layouts are rejected rather than guessed. It replaces only the named installations, verifies installed hashes, retains prior copies under scratch, and writes an external manifest containing Notion page and version IDs, archive hashes, source file hashes, materialized file hashes, and exclusions. Host built-in skills and unrelated shared files are outside the installation destination and must remain untouched.

For an initial installation or an installer update, read and validate the freshly downloaded script in scratch before executing it. An installed older script is not a substitute for reviewing changed installer logic.

## Refresh and completion

Repeat source discovery and fresh downloads for the approved list; do not merely recopy old archives or use GitHub as an authoring source. Compare versions and file hashes with the manifest. Refresh supporting files along with `SKILL.md`, including removed files; do not merge into an old installed tree. An absent or renamed source requires a decision, not automatic deletion.

Verify every installed file against the manifest, inspect the resulting skill inventory, and confirm exclusions remain absent. Report the source changed, installed scope, counts, checks, manifest location, and any skipped or failed skills. Existing sessions may retain an older registry; start a new session to confirm discovery of new skills. No scheduled refresh exists unless the user separately requests one.
