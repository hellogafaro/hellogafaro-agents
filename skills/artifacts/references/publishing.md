# Publishing

`ntncode artifact` gives a file a public link that never expires. It works the same in every agent and prints JSON. Anyone with the link can open the file, so publish only what someone outside this server must open, and never secrets, credentials, client-private data, or personal data.

## Publish

1. Look first with `ntncode artifact list --project <folder> --task TSK-123`. If the same file is already there, share that link.
2. Publish with `ntncode artifact publish <file|folder> --title "<what it shows>" --project <folder> --task TSK-123`.
   - Pass `--project`, the folder under `~/projects`, whenever the work belongs to a project. Add `--task` whenever a Notion task owns it. They file the artifact where `list` finds it later. `--task` needs `--project`.
   - Make the title say what the file shows, such as `"checkout after redesign"`. It becomes the file name, and `--search` matches it.
   - A folder with `index.html` at its top becomes a page with all its files. One publish holds up to 100 MiB.
3. Open the returned `url` and check the file and its type before you share it. Embed images as `![alt](url)`, and show them inline too when the current tools can display them.

Each publish gets a new link. To update a page, publish it again and share the new link.

## Find and delete

- `ntncode artifact list [--project <folder> [--task TSK-123]] [--search "<words>"]` returns the newest 50, each with `url`, `name`, `project`, `task`, `type`, and `created`.
- `ntncode artifact delete <url>` removes one artifact. Delete anything published by mistake, and tell whoever got the link. GitHub's image proxy can keep showing an embedded image for a few hours afterwards.

## If it fails

Follow the `fix` in the error. A refused dot-file, link, or missing `index.html` protects against a leak, so publish a clean copy instead of working around it. In Codex, `ntncode` needs full access. If publishing is still impossible, attach the file to the owning Notion task through `tasks` and say why there is no link.
