<script setup lang="ts">
const hookCards = [
  {
    name: "useOnline",
    description: "Track browser online status with React and Vue adapters.",
    snippet: `import { useOnline } from "@cermuel/hooks/react";

const online = useOnline();`,
  },
];
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

    <div
      class="mt-10 grid grid-cols-1 gap-4 [grid-auto-rows:19rem] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <article
        v-for="hook in hookCards"
        :key="hook.name"
        class="relative h-full"
      >
        <div
          class="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card"
        >
          <div
            class="relative m-2 mb-0 min-h-0 flex-1 overflow-hidden"
          >
            <AtomCodeBlock :code="hook.snippet" class="h-full text-left text-xs leading-6" />
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
            </div>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>
