# Publishing

This reference owns public sharing. Publish a file only when someone outside this server must open it, such as a pull request reviewer, a client, or the public. Otherwise keep it local or with the owning task.

Never publish secrets, credentials, client-private data, or personal data. Anyone with the link can open the file, and it stays until it is deleted.

Publish with OpenCode's artifact tools, in Code Mode under `tools.opencode`. The `artifacts-storage` plugin backs them with the `r2` provider, which stores files in the R2 bucket `g4f4r0-storage` and returns their public link. If the `r2` provider or `artifact_upload` is missing, the plugin is not loaded on this server: report that instead of publishing another way.

1. Publish a page or other text files, such as an HTML report, canvas, plan, or mockup, with `artifact_create`: `title`, `files` as relative path to UTF-8 text (for example `index.html` and `assets/app.js`), and `provider: "r2"`. It returns the `art_` ID and a link that opens the entry file. Without `provider: "r2"` the artifact stays on the OpenCode server, where only signed-in OpenCode clients can open it; keep that default for anything internal.
2. Change a published page in place with `artifact_update` and its `art_` ID. The link stays the same, and the files you pass replace all of its files.
3. Publish an image, PDF, video, or other binary file with `artifact_upload` and the local `path` (and an optional `name` with its extension). It returns the link.
4. Open the returned link and confirm that it returns the file with the right type before you use it.
5. In Markdown and PR comments, embed images as `![alt](url)`.

To remove a page, call `artifact_delete` with its `art_` ID. To remove an upload, call `artifact_upload_delete` with its link. The link returns 404 at once, but GitHub's image proxy can keep showing an embedded image for a few hours. Files published before November 10, 2026 at `files.g4f4r0.dev` no longer exist.
