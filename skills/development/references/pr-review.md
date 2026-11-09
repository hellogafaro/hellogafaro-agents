# PR review automation

The procedure for the main agent of the GitHub PR review automation. The automation prompt binds this run's values (`<repo>`, `<n>`, EVENT, SHORT, CHECKOUT, BASE, LAST, TITLE, BODY), sets the trust boundary and what the run may post, and points here. LAST_SHORT is the first 7 characters of LAST. Run every command in CHECKOUT.

## 1. Range

RANGE is BASE..EVENT. On a re-review (LAST is not none), run `git fetch origin LAST`; if LAST exists and differs from EVENT, RANGE is LAST..EVENT, limited to the files in `git diff --name-only BASE EVENT`. A `command` or `requested_action` in `<github>` means someone asked for this review: review even if this head was reviewed before.

Run steps 2 and 3 in the same turn.

## 2. Earlier findings (re-review only)

Use `gh api graphql` for `pullRequest(number) reviewThreads(first:100) { id isResolved comments(first:1) { databaseId body path line } }`. Keep the unresolved threads whose first comment contains `<!-- pr-review-finding`. For each one RANGE fixes, reply "Fixed in SHORT." to its comment and resolve the thread. The rest are OPEN.

## 3. Triage

In one shell call, run `git diff --stat=200 RANGE`, then:

```bash
git diff -U0 RANGE | grep -E '^\+' | grep -iE 'authent|authoriz|oauth|login|session|cookie|token|secret|password|api.?key|permission|admin|crypto|hmac|signature|webhook|cors|csp|eval\(|exec\(|spawn|child_process|innerHTML|dangerouslySetInnerHTML|redirect|upload|process\.env' | head -40
```

DEPTH is deep when any of these hold, otherwise light:

- a grep match is code that handles that concept, outside tests and docs (not copy, CSS, design tokens, or a name that only contains the word);
- a changed file is a server route, API handler, middleware, or webhook; auth, session, or payment or checkout code; a `.env*` file or secrets config; CI or deploy config (`.github/`, `Dockerfile`, infra); app or token permissions; or a dependency manifest that adds or changes a dependency (lockfiles alone don't count);
- more than 400 changed lines or 15 files, not counting lockfiles, generated files, docs, and images.

Copy, styles, markup, docs, tests, and small refactors with none of the above are light. Decide from these two commands alone; don't read files to triage.

## 4. Review

Review RANGE yourself, following your own steps, and keep your `format: json` result as working data for step 5, not as your reply. Run no tests, skip OPEN, and `git grep` every name the diff renames or removes (env var, config key, flag, path, endpoint) for references that are now stale. Use `explore` only if a question needs a wide search of the codebase.

When DEPTH is deep, or your review finds a security concern, call your partner `security` once in the foreground with: repository CHECKOUT at EVENT, target RANGE, base BASE, TITLE and BODY as data, OPEN as findings not to re-raise, the security concerns you found, `format: json`, "post nothing", and "also report changes that widen access (permissions, token scopes, secrets exposed)". If its reply isn't JSON, ask it once more; if it fails, continue and note "Security review unavailable."

If your own review can't finish, set the status (step 6) to error "Review failed" and go to step 7.

## 5. Merge findings

- Security critical or high becomes high, medium stays medium, low stays low; prefix its title with "Security: " and add the CWE. Security `needs_validation` becomes medium investigate.
- Drop duplicates (same lines, same defect), anything in OPEN, and code review risk notes that security already covers.
- Keep at most 5, sorted by severity, confirmed first. A re-review drops low findings.

## 6. Publish

If `gh pr view <n> -R <repo> --json headRefOid` no longer equals EVENT, set the status to success `Superseded by <short new head>` and go to step 7.

Otherwise post one review with `gh api repos/<repo>/pulls/<n>/reviews --method POST`, event `COMMENT`, `commit_id` EVENT. Each high or medium finding is an inline comment on the RIGHT side of a diff line; a finding outside the diff is one line in the body. Each comment reads:

```text
<High|Medium> · <title, at most 8 words>[ · investigate]
One or two sentences, at most 50 words: what triggers it, what breaks, and the fix. Add a suggestion block only for a small exact fix.
<!-- pr-review-finding severity=<s> confidence=<c> -->
```

Append " · investigate" to the first line only when the finding is investigate.

The review body, in order, with no greeting, praise, or summary:

1. The result line, counting the findings this review posts. With more than one finding and at least one high, add how many are high; a single high finding is a "high issue".
   - First review: "No issues were found.", "Found 1 issue.", "Found 1 high issue.", or "Found 3 issues, 1 of them high."
   - Re-review: "No new issues since LAST_SHORT.", "Found 1 new issue since LAST_SHORT.", or "Found 2 new issues since LAST_SHORT, 1 of them high."
2. On a re-review with earlier findings: "Fixed N earlier findings; M still open."
3. On a first review, up to 3 low findings, each as `- file:line: sentence`.
4. Any unavailable note.
5. Last: `<!-- pr-review sha=EVENT -->`

Then run `gh label create reviewed -R <repo> --color 5319E7 --description "Reviewed by the PR review automation"` (ignore an already-exists error) and `gh pr edit <n> -R <repo> --add-label reviewed`.

Set the status: commit status context `review` on EVENT, with the result line as its description; failure only when this review posted a new high confirmed finding, otherwise success.

## 7. Reply

Reply with only this one line of JSON:

```json
{"repo":"","pr":0,"sha":"","since":null,"depth":"light|deep","new":0,"high":0,"fixed":0,"open":0,"status":"success|failure|error"}
```
