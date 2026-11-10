import assert from "node:assert/strict";
import { test } from "node:test";

import { assertArchivePaths, assertInstructions, isAutoInvoked, parseFrontmatter } from "../scripts/sync-notion-skills.mjs";

test("parses Notion block-scalar frontmatter", () => {
  const metadata = parseFrontmatter(`---
name: |-
  reporting
description: |-
  Use when preparing a report.
notion_page_id: 11111111-2222-3333-4444-555555555555
---
`);

  assert.equal(metadata.name, "reporting");
  assert.equal(metadata.description, "Use when preparing a report.");
  assert.equal(metadata.notion_page_id, "11111111-2222-3333-4444-555555555555");
});

test("rejects archive traversal", () => {
  assert.doesNotThrow(() => assertArchivePaths(["research/SKILL.md"]));
  assert.throws(() => assertArchivePaths(["../outside"]), /Unsafe archive path/u);
  assert.throws(() => assertArchivePaths(["/absolute"]), /Unsafe archive path/u);
});

test("auto-invoke is on unless the Notion checkbox is unticked", () => {
  assert.equal(isAutoInvoked({ properties: { "Auto-invoke": { checkbox: true } } }), true);
  assert.equal(isAutoInvoked({ properties: {} }), true);
  assert.equal(isAutoInvoked({ properties: { "Auto-invoke": { checkbox: false } } }), false);
});

test("rejects empty or cut-short global instructions", () => {
  assert.throws(() => assertInstructions(""), /level-one heading/u);
  assert.throws(() => assertInstructions("# Title\n\nOne line.\n"), /too short/u);
  assert.doesNotThrow(() => assertInstructions(`# Title\n\n${"Rule.\n\n".repeat(10)}`));
});
