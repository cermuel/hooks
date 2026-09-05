<script setup lang="ts">
import { FEATURED_HOOK_SLUGS } from "~/constants/home";
import { getHookBySlug } from "~/utils/hooks";
import type { HookFramework } from "../../../../../packages/hooks/src/types/hook";

const hookCards = computed(() =>
  FEATURED_HOOK_SLUGS.map((slug) => getHookBySlug(slug)).filter(
    (hook) => hook !== undefined
  )
);

const activeFrameworks = reactive<Record<string, HookFramework>>(
  Object.fromEntries(
    hookCards.value.map((hook) => [hook.slug, hook.frameworks[0] ?? "react"])
  ) as Record<string, HookFramework>
);
</script>

<template>
  <section
    id="hooks"
    class="mx-auto max-w-7xl border-t border-border px-4 pb-16 pt-14"
  >
    <div
      class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <p
          class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
        >
          Hooks
        </p>
        <h2
          class="mt-3 font-display text-3xl font-semibold leading-tight tracking-normal text-foreground md:text-4xl"
        >
          Browse hooks
        </h2>
      </div>
      <AtomButton
        label="Browse all hooks"
        to="/hooks"
        variant="ghost"
        size="sm"
        right-icon="lucide:arrow-right"
        static
      />
    </div>

    <div
      class="grid grid-cols-1 gap-4 [grid-auto-rows:20rem] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
    >
      <UiHookCard
        v-for="hook in hookCards"
        :key="hook.name"
        v-model="activeFrameworks[hook.slug]"
        :hook="hook"
      />
    </div>
  </section>
</template>
