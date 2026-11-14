# Updating

## Inspect before editing

1. Download and read the entire selected Notion skill and every reference needed for the requested change. In Executor, find the Notion connection by its label "Hello Gafaro", never by a stored account ID, and download with `tools.notion.api.agentSkills.getSkillDirectory`.
2. Search the canonical library and active runtime inventories for its name, installation paths, and consumers.
3. Compare installed or GitHub copies with the Notion download before attributing drift.
4. Identify whether the correction belongs in the skill, a reference, a script, project instructions, or mutable configuration.

## Make the change

- Preserve the skill's trigger boundary unless the user intentionally changes scope.
- Keep the main file compact and move edge cases into focused references.
- Update scripts only when deterministic behavior changes.
- Remove stale instructions instead of leaving competing workflows.
- Route feedback to the narrowest responsible layer before editing shared guidance. A task defect or project-specific preference is not automatically a skill rule. For an explicitly requested reusable correction or an approved generalizable lesson, update the existing canonical owner and relevant consumers, then verify the affected behavior. If the rule was adequate but missed, fix its discovery or execution rather than duplicating it. Inferred organization-wide policy needs approval before publication.
- Never add secrets, account ids, tokens, mailbox selectors, or other mutable routing data. Stable database ids follow the rule in [prerequisites](prerequisites.md).

## Validate

Upload the complete revised directory to the existing Notion skill page with `tools.notion.skills.upload`: pass `page_id` and `files`, with `SKILL.md` plus each supporting file by its relative path, such as `references/x.md`. Insert each file's content from the edited files rather than retyping it. Each upload stops for an Executor approval, which a routine cannot clear. Download it again with `getSkillDirectory` and diff the body and supporting files against the backup. Notion may normalize Markdown tables, code-fence aliases, and list numbering. Confirm that the meaning remains intact. Do not trigger GitHub synchronization or replace installed copies without reviewing the result and obtaining any required approval.

After approved synchronization, read the installation through the active runtime and record its revision. Use the applicable refresh adapter and record source versions and file hashes in the external manifest. Confirm that consuming instructions agree with the correction and that only one intended installation is discovered. State that existing running sessions may retain an older snapshot until their configuration is assembled again.
