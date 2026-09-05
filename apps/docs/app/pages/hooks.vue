<script setup lang="ts">
import { getPrimaryExample, hooks } from "~/utils/hooks";
import type { HookFramework } from "../../../../packages/hooks/src/types/hook";

const activeFrameworks = reactive<Record<string, HookFramework>>(
  Object.fromEntries(
    hooks.map((hook) => [hook.slug, hook.frameworks[0] ?? "react"])
  ) as Record<string, HookFramework>
);

function getActiveExample(hook: (typeof hooks)[number]) {
  const activeFramework = activeFrameworks[hook.slug] ?? hook.frameworks[0] ?? "react";

  return hook.examples[activeFramework] ?? getPrimaryExample(hook);
}

function getFrameworkTabs(hook: (typeof hooks)[number]) {
  return hook.frameworks.map((framework) => ({
    label: framework === "react" ? "React" : "Vue",
    value: framework,
  }));
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 pb-20 pt-28">
    <p
      class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
    >
      Hooks
    </p>
    <h1
      class="mt-3 font-display text-4xl font-semibold leading-tight tracking-normal text-foreground md:text-5xl"
    >
      Browse hooks
    </h1>
    <p class="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
      Framework-native hooks with examples pulled directly from the package source.
    </p>

    <div
      class="mt-10 grid grid-cols-1 gap-4 [grid-auto-rows:19rem] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <article
        v-for="hook in hooks"
        :key="hook.name"
        class="relative h-full"
      >
        <div
          class="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card"
        >
          <div class="relative m-2 mb-0 min-h-0 flex-1 overflow-hidden">
            <AtomCodeBlock
              :code="getActiveExample(hook)"
              class="h-full text-left text-xs leading-6"
            />
          </div>
          <div
            class="flex shrink-0 items-center justify-between gap-3 px-4 py-3.5"
          >
            <div class="min-w-0">
              <h2
                class="truncate font-display text-[0.95rem] font-semibold tracking-normal text-foreground"
              >
                {{ hook.name }}
              </h2>
              <p
                class="mt-0.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground"
              >
                {{ hook.description }}
              </p>
            </div>
            <AtomTabs
              v-if="hook.frameworks.length > 1"
              v-model="activeFrameworks[hook.slug]"
              :items="getFrameworkTabs(hook)"
              aria-label="Example framework"
              variant="pill"
            />
          </div>
        </div>
      </article>
    </div>
  </main>
</template>
