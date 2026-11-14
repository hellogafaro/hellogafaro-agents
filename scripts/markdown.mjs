/** Sets `disable-model-invocation: true` in a SKILL.md frontmatter block. */
export function disableModelInvocation(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---(?=\n|$)/u);
  if (!match) throw new Error("SKILL.md must start with YAML frontmatter.");

  const lines = match[1].split("\n");
  const index = lines.findIndex((line) => /^disable-model-invocation:/u.test(line));
  if (index === -1) lines.push("disable-model-invocation: true");
  else lines[index] = "disable-model-invocation: true";

  return `${["---", ...lines, "---"].join("\n")}${markdown.slice(match[0].length)}`;
}
