<script setup lang="ts">
type TokenTone =
  | "base"
  | "prompt"
  | "command"
  | "package"
  | "flag"
  | "keyword"
  | "string"
  | "muted";

interface CodeToken {
  text: string;
  tone: TokenTone;
}

const props = withDefaults(
  defineProps<{
    code: string;
    command?: boolean;
  }>(),
  {
    command: false,
  }
);

const toneClasses: Record<TokenTone, string> = {
  base: "text-code-base",
  prompt: "text-code-prompt",
  command: "text-code-command",
  package: "text-code-package",
  flag: "text-code-flag",
  keyword: "text-code-keyword",
  string: "text-code-string",
  muted: "text-code-muted",
};

function tokenizeCommand(line: string): CodeToken[] {
  const match = line.match(/^(\$\s*)(.*)$/);

  if (!match) {
    return [{ text: line, tone: "base" }];
  }

  const prompt = match[1] ?? "";
  const command = match[2] ?? "";

  return [
    { text: prompt, tone: "prompt" },
    ...command.split(/(\s+)/).map((part, index) => {
      if (/^\s+$/.test(part)) {
        return { text: part, tone: "base" as const };
      }

      if (index === 0) {
        return { text: part, tone: "command" as const };
      }

      if (part.startsWith("@") || part.includes("/")) {
        return { text: part, tone: "package" as const };
      }

      if (part.startsWith("--")) {
        return { text: part, tone: "flag" as const };
      }

      return { text: part, tone: "base" as const };
    }),
  ];
}

function tokenizeSnippet(line: string): CodeToken[] {
  return line.split(/(\s+|["'{}();?:])/).map((part) => {
    if (!part) {
      return { text: part, tone: "base" };
    }

    if (/^\s+$/.test(part)) {
      return { text: part, tone: "base" };
    }

    if (/^["']$/.test(part)) {
      return { text: part, tone: "string" };
    }

    if (
      ["import", "export", "from", "function", "const", "return"].includes(part)
    ) {
      return { text: part, tone: "keyword" };
    }

    if (part.startsWith("@cermuel/hooks")) {
      return { text: part, tone: "package" };
    }

    if (["true", "false", "Online", "Offline"].includes(part)) {
      return { text: part, tone: "string" };
    }

    if (["{", "}", "(", ")", ";", "?", ":"].includes(part)) {
      return { text: part, tone: "muted" };
    }

    return { text: part, tone: "base" };
  });
}

const lines = computed(() =>
  props.code
    .split("\n")
    .map((line) =>
      props.command ? tokenizeCommand(line) : tokenizeSnippet(line)
    )
);
</script>

<template>
  <pre
    class="relative overflow-x-auto rounded-[1.25rem] border border-code-border bg-code-surface dark:bg-code-surface/65 px-4 py-3 font-mono text-sm leading-7 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.03)]"
  ><code><span
    v-for="(line, lineIndex) in lines"
    :key="lineIndex"
    class="block whitespace-pre"
  ><span
    v-for="(token, tokenIndex) in line"
    :key="`${lineIndex}-${tokenIndex}`"
    :class="toneClasses[token.tone]"
  >{{ token.text }}</span></span></code></pre>
</template>
