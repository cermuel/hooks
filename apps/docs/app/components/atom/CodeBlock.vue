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
    expandable?: boolean;
    class?: string;
  }>(),
  {
    command: false,
    expandable: true,
    class: "",
  }
);

const contentRef = ref<HTMLDivElement | null>(null);
const expanded = ref(false);
const canExpand = ref<boolean | null>(props.expandable ? null : false);
let resizeObserver: ResizeObserver | undefined;

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

const contentClasses = computed(() => {
  if (expanded.value) {
    return "max-h-[640px] overflow-auto";
  }

  if (canExpand.value === false) {
    return "max-h-none";
  }

  return "max-h-[320px] overflow-hidden";
});

const expandOverlayClasses = computed(() => [
  "pointer-events-none absolute inset-x-0 bottom-0 flex h-28 items-end justify-center bg-linear-to-t pb-4 pt-12",
  props.class
    ? "from-card via-card/90 to-transparent"
    : "from-[#080808] via-[#080808]/90 to-transparent",
]);

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
  return line.split(/(\s+|["'`{}[\]();?:,])/).map((part) => {
    if (!part || /^\s+$/.test(part)) {
      return { text: part, tone: "base" };
    }

    if (/^["'`]$/.test(part)) {
      return { text: part, tone: "string" };
    }

    if (
      [
        "as",
        "async",
        "await",
        "const",
        "export",
        "false",
        "from",
        "function",
        "if",
        "import",
        "let",
        "return",
        "true",
        "type",
      ].includes(part)
    ) {
      return { text: part, tone: "keyword" };
    }

    if (part.startsWith("@cermuel/hooks")) {
      return { text: part, tone: "package" };
    }

    if (["{", "}", "[", "]", "(", ")", ";", "?", ":", ","].includes(part)) {
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

function checkHeight() {
  if (!props.expandable) {
    canExpand.value = false;
    return;
  }

  const el = contentRef.value;

  if (!el) {
    canExpand.value = null;
    return;
  }

  canExpand.value = el.scrollHeight > 320;
}

onMounted(() => {
  const el = contentRef.value;

  if (!el) {
    return;
  }

  resizeObserver = new ResizeObserver(checkHeight);
  resizeObserver.observe(el);
  void nextTick(checkHeight);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

watch(
  () => props.code,
  async () => {
    expanded.value = false;
    await nextTick();
    checkHeight();
  },
  { immediate: true }
);
</script>

<template>
  <div
    :class="[
      'relative overflow-hidden rounded-[1.25rem] border border-[#242424] bg-[#080808] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.03)',
      props.class,
    ]"
  >
    <div
      ref="contentRef"
      :class="[
        'transition-[max-height] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]',
        contentClasses,
      ]"
    >
      <pre
        class="code-block-pre overflow-x-auto bg-transparent! px-0 py-2.5 font-mono text-xs leading-6"
      ><code class="block min-w-max px-4"><span
        v-for="(line, lineIndex) in lines"
        :key="lineIndex"
        class="block whitespace-pre-wrap"
      ><span
        v-for="(token, tokenIndex) in line"
        :key="`${lineIndex}-${tokenIndex}`"
        :class="toneClasses[token.tone]"
      >{{ token.text }}</span></span></code></pre>
    </div>

    <div v-if="!expanded && canExpand" :class="expandOverlayClasses">
      <button
        type="button"
        class="pointer-events-auto rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        :aria-expanded="expanded"
        @click="expanded = true"
      >
        Expand Code
      </button>
    </div>
  </div>
</template>

<style scoped>
.code-block-pre {
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  color: #d4d4d4;
  text-shadow: none;
}
</style>
