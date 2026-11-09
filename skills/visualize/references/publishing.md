# Publishing

This reference owns public sharing. Publish a file only when someone outside this server must open it, such as a pull request reviewer, a client, or the public. Otherwise keep it local or with the owning task.

Never publish secrets, credentials, client-private data, or personal data. Anyone with the URL can read the file.

1. Upload through Executor's Cloudflare connection with `tools.cloudflare.r2Object.r2PutObject` to the bucket `g4f4r0-files`. Read its signature with `describe` first. Set the input's `contentType`, not the `Content-Type` header, to the file's exact type from the signature's list, such as `image/png`, `text/html; charset=utf-8`, or `application/pdf`. For the `text/` types, `body` is the text itself; for the others it is the bytes as base64. A type outside the list can only be stored as `application/octet-stream`, which browsers download instead of showing.
2. Name the object key `YYYY-MM/<random 16+ hex>/<filename>`, for example `2026-11/9f2c4e1ab37d5068/after.png` (`openssl rand -hex 8`). The public URL is `https://files.g4f4r0.dev/<key>`.
3. Open the URL and confirm that it returns the file with the right type before you use it.
4. In Markdown and PR comments, embed images as `![alt](url)`.

Files are kept forever. To remove one, delete its key with `tools.cloudflare.r2Object.r2DeleteObject` and confirm that the URL returns 404 or a cached copy (`cf-cache-status: HIT`). Removal is not instant: Cloudflare, and GitHub's image proxy for embedded images, can keep serving a deleted image or PDF for up to about 4 hours.
