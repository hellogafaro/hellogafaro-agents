const fencePattern = /^\s{0,3}(`{3,}|~{3,})/u;
const emptyBlockPattern = /^\s*<(?:empty-block|p)\s*\/>\s*$/u;

function toCodeSpan(code) {
  const longest = Math.max(0, ...(code.match(/`+/gu) ?? []).map((run) => run.length));
  const fence = "`".repeat(longest + 1);
  const padding = code.startsWith("`") || code.endsWith("`") ? " " : "";
  return `${fence}${padding}${code}${padding}${fence}`;
}

function normalizeInline(line) {
  return line
    .replace(/<code>([\s\S]*?)<\/code>/gu, (_, code) => toCodeSpan(code))
    .replace(/<(page|database|mention)\s+[^>]*?url="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gu, (_, _tag, url, label) => `[${label}](${url})`)
    .replace(/<mention\s+[^>]*?url="([^"]+)"[^>]*\/>/gu, (_, url) => `<${url}>`)
    .replace(/<\/?(?:span|u)(?:\s[^>]*)?>/gu, "");
}

function isClosingFence(line, fence) {
  const trimmed = line.trim();
  return trimmed.length >= fence.length && trimmed === fence[0].repeat(trimmed.length);
}

/** Converts Notion-flavored markdown into plain CommonMark that every harness reads the same way. */
export function normalizeNotionMarkdown(markdown) {
  const lines = [];
  let depth = 0;
  let fence = null;
  let icon = "";

  const push = (text, isCode = false) => {
    let content = text;
    if (icon && content.trim() !== "") {
      content = `${icon} ${content}`;
      icon = "";
    }
    const line = `${"> ".repeat(depth)}${content}`.trimEnd();
    if (!isCode && line === "" && (lines.length === 0 || lines.at(-1) === "")) return;
    lines.push(line);
  };

  for (const line of markdown.replaceAll("\r\n", "\n").split("\n")) {
    if (fence) {
      push(line, true);
      if (isClosingFence(line, fence)) fence = null;
      continue;
    }

    const opening = line.match(fencePattern);
    if (opening) {
      fence = opening[1];
      push(line, true);
      continue;
    }

    const callout = line.match(/^\s*<callout(?:\s+([^>]*))?>\s*(.*)$/u);
    if (callout) {
      if (depth === 0) push("");
      depth += 1;
      icon = callout[1]?.match(/icon="([^"/]*)"/u)?.[1] ?? "";
      if (callout[2].trim()) push(normalizeInline(callout[2]));
      continue;
    }
    if (/^\s*<\/callout>\s*$/u.test(line)) {
      icon = "";
      depth = Math.max(0, depth - 1);
      if (depth === 0) push("");
      continue;
    }

    push(emptyBlockPattern.test(line) ? "" : normalizeInline(line));
  }

  while (lines.at(-1) === "") lines.pop();
  return lines.length === 0 ? "" : `${lines.join("\n")}\n`;
}

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
