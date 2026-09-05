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
</script>

<template>
  <NuxtLink :href="'/hooks/' + hook.slug">
    <article :id="hook.slug" class="relative h-full scroll-mt-24">
      <div
        class="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
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
          />
        </div>
        <div
          class="flex shrink-0 items-center justify-between gap-3 px-4 py-3.5"
        >
          <AtomTabs
            v-if="hook.frameworks.length > 1"
            v-model="activeFramework"
            :items="frameworkTabs"
            aria-label="Example framework"
            variant="pill"
            size="xs"
            class="bg-white! dark:bg-black/70! max-h-40"
          />
          <NuxtLink
            v-if="hook.author?.github"
            :href="'https://github.com/' + hook.author.github"
            class="flex items-center gap-1 pr-3 text-sm transition-all duration-300 hover:pr-4.5 hover:font-medium hover:text-white"
          >
            <Icon name="lucide-github" aria-hidden="true" />
            {{ hook.author.github }}
          </NuxtLink>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>
