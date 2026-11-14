# Prerequisites

## Resolve the source

1. Find the skill in the live Notion Skills library.
2. Download the complete skill directory, including supporting files, before changing it.
3. Treat the Notion page ID as the stable source identity.
4. Edit a staging copy of the complete canonical download, never runtime installations, plugin caches, or generated mirrors. Publish to the source, then reinstall from a verified fresh export.
5. If the skill is missing from Notion but exists in GitHub or an installation, treat that copy as migration input, not as a new canonical source.

## Verify Notion

Use the Notion connection in Executor labeled "Hello Gafaro". Look it up by label on every run; account IDs change when a connection is refreshed. Download with `tools.notion.api.agentSkills.getSkillDirectory` and upload the complete directory with `tools.notion.skills.upload` (`page_id`, plus `files` with `SKILL.md` and each supporting file by relative path, contents inserted from the files rather than retyped). Each upload stops for an Executor approval that a routine cannot clear. Confirm that the selected connection can search, download, and upload skills. Fetch the target Skills database before creating a page so its current data source and title property are known.

Never store connection tokens or account IDs in a skill. Stable database and data source IDs for Johan's own workspace databases are allowed in operations skills, such as `tasks`, to skip lookups; pair each with a fallback that looks the database up by name if the ID fails.

After an upload, download the skill again with `getSkillDirectory`, diff it against the backup, and compare its `SKILL.md` instructions and supporting files with the intended source. Notion may normalize Markdown formatting and emits only standard skill frontmatter.

## Verify distribution only when needed

For GitHub backup or installation work, verify the generated repository, GitHub CLI version, authentication, and repository access. Never edit the mirror to fix a Notion skill. If the mirror differs, repair or rerun the Notion-to-GitHub sync.

For direct filesystem installation, discover the approved scope and host adapter. The bundled installer requires Python 3.9 or newer and PyYAML. Repository distribution is unnecessary when the host consumes verified canonical exports directly.
