---
name: |-
  git
description: |-
  Handles authorized Git and GitHub operations when the host lacks its own workflow. Covers commits, pull requests, reviews, and releases; defer to native lifecycle tools when available.
notion_page_id: 3dffc798-2e43-8122-9dcc-f8443b6357eb
---

# git

Work from the real repository state. Prefer the host's native Git and review lifecycle; use the commands below only when it is unavailable. Installations whose host already owns these operations exclude this skill.

## Workflow

1. Run `git status --short --branch`.
2. Inspect staged changes first with `git diff --staged`.
3. If nothing is staged, inspect the working tree diff.
4. Keep one logical change per commit, PR, merge, or release.
5. Leave unrelated local changes untouched unless the user asks to include them.
6. Report what changed and what was verified.

## Commits

- Stage only files that belong to the requested logical change, and check the staged diff before committing.
- Write a short imperative subject with an obvious prefix: `fix:`, `feat:`, `docs:`, `test:`, `refactor:`, `chore:`. For example, `fix: preserve selected filters`.
- Add a body only when the diff is not self-explanatory and the body explains important why, risk, migration, or breaking behavior.

## Pull requests

- Use `gh pr` for PR creation, checks, status, and review data.
- Write the title and body as "Pull requests" in `development/references/git-and-prs.md` defines: a `type: imperative summary` title, and a body with Summary, QA and Notes, based on the actual diff.
- Do not invent issue links, reviewers, labels, or test results.
- Before marking ready, check branch status and CI when available.
- Engineering completion needs meaningful proof from real checks, even for small nonvisual changes. Use the smallest useful evidence: a fresh screenshot or clip, a measured comparison, or a compact evidence table or diagram. Use a canvas only when substantial information needs a separate artifact or the user asks for one; completion or review alone never requires it. Evidence must support the outcome and preserve the reviewed revision and actual verdict when applicable. A decorative diagram or test-count summary alone is not proof. Detailed evidence and operational follow-ups go in the handoff or PR.
- Discover available reviewers and their capabilities through the active runtime. Pick a suitable independent reviewer for the changed domain, within project restrictions. Keep model and provider names out of reusable instructions.
- Before declaring completion, request review of the PR's current base and head, actual diff, requirements, and completion evidence. A request or a passing CI run is not a review verdict. For high-impact work, get a second independent reviewer on another provider through the coordinating owner when available. If no eligible reviewer is available, report the missing review.
- The reviewer returns findings, verified, failed, and unverified checks, a verdict, the reviewed head SHA, and proposed review text. Before posting a human-facing review or reply, show the exact draft and destination and get approval. Read existing reviews to avoid duplicates, then verify any authorized publication and its reviewed revision.
- Use a formal GitHub review where the authenticated identity permits it. If the shared identity authored the PR and GitHub rejects self-approval, post the independent review as a PR comment with the reviewer attribution and reviewed head SHA. Never claim a comment satisfies a required platform approval.
- Fix required findings and get the affected changes reviewed on the new head before claiming completion. A prior verdict does not cover a changed head, and unverified required checks cannot pass. With no PR, review the exact local revision and return the verdict in the handoff; never create or publish a PR just to satisfy this rule without authorization.

## Merges and releases

- Merge only as "Merges and releases" in `development/references/git-and-prs.md` allows.
- Prefer platform-native merge commands such as `gh pr merge`.
- For tags and releases, inspect existing tags and releases first.
- Release notes come from commits, PRs, the changelog, or user-provided context. Group them into user-facing changes, fixes, migrations, and known risks when those categories exist.

## Safety

- Never commit secrets, credentials, `.env` files, private keys, or unrelated files.
- Never change git config unless the user asks.
- Never run destructive commands, force push, rewrite shared history, or skip hooks unless the user explicitly asks.
- If hooks fail, fix the issue and create the commit normally.
