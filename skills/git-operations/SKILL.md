---
name: |-
  git-operations
description: |-
  Handles authorized Git and GitHub operations when the host lacks its own workflow. Covers commits, pull requests, reviews, and releases; defer to native lifecycle tools when available.
notion_page_id: 3dffc798-2e43-8122-9dcc-f8443b6357eb
---

# git-operations

Handle Git and GitHub work from the real repository state.

Prefer the host's native Git and review lifecycle. Use the commands below only as a fallback when that workflow is unavailable. This skill is excluded from installations whose host already owns these operations.

## Workflow

1. Run `git status --short --branch`.
2. Inspect staged changes first with `git diff --staged`.
3. If nothing is staged, inspect the working tree diff.
4. Keep one logical change per commit, PR, merge, or release.
5. Leave unrelated local changes untouched unless the user asks to include them.
6. Report what changed and what was verified.

## Commits

- Stage only files that belong to the requested logical change.
- Check the staged diff before committing.
- Use a short imperative subject.
- Prefer obvious prefixes: `fix:`, `feat:`, `docs:`, `test:`, `refactor:`, `chore:`.
- Do not add a body unless it explains important why, risk, migration, or breaking behavior.

Good subjects:

- `fix: preserve selected filters`
- `feat: add handoff skill`
- `docs: clarify deployment steps`

Use a commit body when the diff is not self-explanatory:

```txt
fix: preserve selected filters

The previous reset path cleared user-selected filters after refresh. Keep the
selection stable while still removing invalid values from the result set.
```

## Pull requests

- Use `gh pr` for PR creation, checks, status, and review data.
- Write the title and body as "Pull requests" in `development/references/git-and-prs.md` defines: a `type: imperative summary` title, and a body with Summary, QA and Notes, based on the actual diff.
- Do not invent issue links, reviewers, labels, or test results.
- Before marking ready, check branch status and CI when available.
- Engineering completion requires meaningful proof backed by real checks, including for small nonvisual changes. Use the smallest useful evidence: a fresh screenshot or clip, a measured comparison, or a compact evidence table or diagram. Use a canvas only when substantial information needs a separate artifact or the user explicitly requests one; completion or review alone never requires it. Evidence must support the outcome and preserve the reviewed revision and actual verdict when applicable. A decorative diagram or test-count summary alone is not proof. Keep detailed evidence and operational follow-ups in the handoff or PR; keep final chat concise.
- Discover available reviewers and their capabilities through the active runtime. Select a suitable independent reviewer for the changed domain, respecting project restrictions. Keep model and provider names out of reusable instructions.
- Request review of the PR's current base and head, actual diff, requirements, and completion evidence before declaring completion. A request or successful CI run is not a review verdict. For high-impact work, select a second independent reviewer on another provider through the coordinating owner when available; report the missing review if no eligible reviewer is available.
- The reviewer returns findings, verified/failed/unverified checks, verdict, reviewed head SHA, and proposed review text. Before posting a human-facing review or reply, show the exact draft and destination and obtain approval. Read existing reviews to avoid duplicates, then verify any authorized publication and reviewed revision.
- Use a formal GitHub review where the authenticated identity permits it. If the shared identity authored the PR and GitHub rejects self-approval, publish the independent review as a PR comment with the reviewer attribution and reviewed head SHA. Never claim that a comment satisfies a required platform approval.
- Fix required findings and obtain review of the affected changes on the new head before claiming completion. A prior verdict does not cover a changed head, and unverified required checks cannot pass. If there is no PR, review the exact local revision and return the verdict in the handoff; do not create or publish a PR merely to satisfy this rule without authorization.

## Merges and releases

- Merge only as "Merges and releases" in `development/references/git-and-prs.md` allows.
- Prefer platform-native merge commands such as `gh pr merge`.
- For tags and releases, inspect existing tags/releases first.
- Release notes must come from commits, PRs, changelog, or user-provided context.
- Release notes should group user-facing changes, fixes, migrations, and known risks when those categories exist.

## Safety

- Never commit secrets, credentials, `.env` files, private keys, or unrelated files.
- Never change git config unless the user asks.
- Never run destructive commands unless the user explicitly asks.
- Never force push, rewrite shared history, or skip hooks unless the user explicitly asks.
- If hooks fail, fix the issue and create the commit normally.
