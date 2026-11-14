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

  return { request, queryDataSource };
}
