const notionVersion = "2026-03-11";

/** Creates a Notion API client that retries rate limits, server errors and network failures. */
export function createNotion(token, { baseUrl = process.env.NOTION_API_URL ?? "https://api.notion.com/v1", attempts = 4, sleep } = {}) {
  const wait = sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));

  async function request(pathname, init = {}) {
    let lastError;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      let response;
      try {
        response = await fetch(`${baseUrl}${pathname}`, {
          ...init,
          headers: {
            Authorization: `Bearer ${token}`,
            "Notion-Version": notionVersion,
            ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
          },
          signal: AbortSignal.timeout(30_000),
        });
      } catch (error) {
        lastError = new Error(`Notion ${pathname} unreachable: ${error.cause?.code ?? error.message}`);
        if (attempt < attempts - 1) await wait(1_000 * 2 ** attempt);
        continue;
      }

      if (response.ok) return response.json();
      const body = await response.text();
      lastError = Object.assign(new Error(`Notion ${pathname} failed (${response.status}): ${body.slice(0, 300)}`), {
        status: response.status,
      });
      if (response.status !== 429 && response.status < 500) throw lastError;
      if (attempt < attempts - 1) {
        const retryAfter = Number(response.headers.get("retry-after"));
        await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1_000 : 1_000 * 2 ** attempt);
      }
    }
    throw lastError;
  }

  async function queryDataSource(dataSourceId, body = {}) {
    const pages = [];
    let cursor;
    do {
      const response = await request(`/data_sources/${dataSourceId}/query`, {
        method: "POST",
        body: JSON.stringify({ page_size: 100, ...body, ...(cursor ? { start_cursor: cursor } : {}) }),
      });
      pages.push(...response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);
    return pages;
  }

  async function getChildren(blockId) {
    const blocks = [];
    let cursor;
    do {
      const query = new URLSearchParams({ page_size: "100", ...(cursor ? { start_cursor: cursor } : {}) });
      const response = await request(`/blocks/${blockId}/children?${query}`);
      blocks.push(...response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);
    return blocks;
  }

  async function getPageMarkdown(pageId) {
    const response = await request(`/pages/${pageId}/markdown?markdown_version=v2`);
    if (response.truncated) throw new Error(`Notion page ${pageId} markdown is truncated.`);
    if (response.unknown_block_ids?.length) {
      throw new Error(`Notion page ${pageId} has ${response.unknown_block_ids.length} blocks that could not be exported.`);
    }
    if (typeof response.markdown !== "string") throw new Error(`Notion page ${pageId} returned no markdown.`);
    return response.markdown;
  }

  return { request, queryDataSource, getChildren, getPageMarkdown };
}

/** Joins the plain text of a Notion rich text or title property. */
export function getPlainText(property) {
  const parts = property?.title ?? property?.rich_text ?? [];
  return parts.map((part) => part.plain_text ?? part.text?.content ?? "").join("");
}
