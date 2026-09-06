<script setup lang="ts">
import type { DocsHook } from "~/utils/hooks";
import { getPrimaryExample } from "~/utils/hooks";
import type { HookFramework } from "../../../../../packages/hooks/src/types/hook";

const props = defineProps<{
  hook: DocsHook;
  modelValue?: HookFramework;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: HookFramework];
}>();

const activeFramework = computed({
  get: () => props.modelValue ?? props.hook.frameworks[0] ?? "react",
  set: (value) => emit("update:modelValue", value),
});

const activeExample = computed(
  () =>
    props.hook.examples[activeFramework.value] ?? getPrimaryExample(props.hook)
);

const frameworkTabs = computed(() =>
  props.hook.frameworks.map((framework) => ({
    icon:
      framework === "react" ? "simple-icons:react" : "simple-icons:vuedotjs",
    label: "",
    value: framework,
  }))
);

const hookHref = computed(() => `/hooks/${props.hook.slug}`);

function shouldIgnoreCardClick(event: Event): boolean {
  const target = event.target;

  return (
    target instanceof Element &&
    Boolean(
      target.closest(
        "a, button, input, textarea, select, [contenteditable='true'], [role='tab'], [role='tablist']"
      )
    )
  );
}

function openHook(event: MouseEvent): void {
  if (shouldIgnoreCardClick(event)) {
    return;
  }

  void navigateTo(hookHref.value);
}

function openHookFromKeyboard(event: KeyboardEvent): void {
  if (shouldIgnoreCardClick(event)) {
    return;
  }

  void navigateTo(hookHref.value);
}
</script>

<template>
  <article
    :id="hook.slug"
    class="relative h-full scroll-mt-24"
    role="link"
    tabindex="0"
    @click="openHook"
    @keydown.enter="openHookFromKeyboard"
    @keydown.space.prevent="openHookFromKeyboard"
  >
    <div
      class="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div class="px-4 pt-2.5">
        <h2
          class="truncate font-display text-[0.95rem] font-semibold tracking-normal text-foreground"
        >
          {{ hook.name }}
        </h2>
      </div>
      <div class="relative m-2 mb-0 min-h-0 flex-1 overflow-hidden">
        <AtomCodeBlock
          :code="activeExample"
          class="h-full text-left text-xs leading-6"
          :expandable="false"
        />
      </div>
      <div class="flex shrink-0 items-center justify-between gap-3 px-4 py-3.5">
        <AtomTabs
          v-if="hook.frameworks.length > 1"
          v-model="activeFramework"
          :items="frameworkTabs"
          aria-label="Example framework"
          variant="pill"
          size="xs"
          class="bg-white! dark:bg-black/70! max-h-40 cursor-default"
        />
        <NuxtLink
          v-if="hook.author?.github"
          :href="'https://github.com/' + hook.author.github"
          target="_blank"
          class="flex cursor-pointer items-center gap-1 pr-3 text-sm underline underline-offset-2 transition-all duration-300 hover:pr-4 hover:font-medium hover:text-white"
        >
          <Icon name="lucide-github" aria-hidden="true" />
          {{ hook.author.github }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
