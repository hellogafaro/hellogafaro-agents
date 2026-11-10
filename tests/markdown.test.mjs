import assert from "node:assert/strict";
import { test } from "node:test";

import { disableModelInvocation, normalizeNotionMarkdown } from "../scripts/markdown.mjs";

test("converts Notion inline code back to backticks", () => {
  assert.equal(
    normalizeNotionMarkdown("Run <code>save --match <name></code> and <code>a`b</code>."),
    "Run `save --match <name>` and ``a`b``.\n",
  );
});

test("keeps fenced code, numbered lists and blank lines exactly", () => {
  const markdown = "# Title\n\n1. One\n2. Two\n\n```bash\nreport=$(mktemp)\n\n\n<code>literal</code> \\\n  sh\n```\n\nEnd\n";
  assert.equal(normalizeNotionMarkdown(markdown), markdown);
});

test("drops empty blocks and collapses the blank lines they leave", () => {
  assert.equal(normalizeNotionMarkdown("One\n\n<empty-block/>\n\n<p />\n\nTwo\n<empty-block />\n"), "One\n\nTwo\n");
});

test("turns callouts into block quotes that end cleanly", () => {
  const markdown = '<callout icon="💡" color="yellow_bg">\nCheck <code>x</code> first.\n\n- detail\n</callout>\nAfter';
  assert.equal(normalizeNotionMarkdown(markdown), "> 💡 Check `x` first.\n>\n> - detail\n\nAfter\n");
});

test("turns mentions, sub-pages and spans into plain markdown", () => {
  const markdown = '<mention url="https://app.notion.com/p/abc">Spec</mention> and <span color="red">red</span>\n\n<page url="https://app.notion.com/p/def">Child</page>';
  assert.equal(normalizeNotionMarkdown(markdown), "[Spec](https://app.notion.com/p/abc) and red\n\n[Child](https://app.notion.com/p/def)\n");
});

test("returns an empty string for an empty page", () => {
  assert.equal(normalizeNotionMarkdown("<empty-block/>\n\n"), "");
});

test("adds disable-model-invocation to SKILL.md frontmatter once", () => {
  const skill = "---\nname: |-\n  sync\ndescription: |-\n  Sync things.\nnotion_page_id: 1\n---\n\n# sync\n";
  const expected = "---\nname: |-\n  sync\ndescription: |-\n  Sync things.\nnotion_page_id: 1\ndisable-model-invocation: true\n---\n\n# sync\n";
  assert.equal(disableModelInvocation(skill), expected);
  assert.equal(disableModelInvocation(expected), expected);
  assert.equal(disableModelInvocation(expected.replace(": true", ": false")), expected);
  assert.throws(() => disableModelInvocation("# no frontmatter"), /frontmatter/u);
});
