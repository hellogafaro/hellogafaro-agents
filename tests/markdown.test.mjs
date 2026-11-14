import assert from "node:assert/strict";
import { test } from "node:test";

import { disableModelInvocation } from "../scripts/markdown.mjs";

test("adds disable-model-invocation to SKILL.md frontmatter once", () => {
  const skill = "---\nname: |-\n  sync\ndescription: |-\n  Sync things.\nnotion_page_id: 1\n---\n\n# sync\n";
  const expected = "---\nname: |-\n  sync\ndescription: |-\n  Sync things.\nnotion_page_id: 1\ndisable-model-invocation: true\n---\n\n# sync\n";
  assert.equal(disableModelInvocation(skill), expected);
  assert.equal(disableModelInvocation(expected), expected);
  assert.equal(disableModelInvocation(expected.replace(": true", ": false")), expected);
  assert.throws(() => disableModelInvocation("# no frontmatter"), /frontmatter/u);
});
