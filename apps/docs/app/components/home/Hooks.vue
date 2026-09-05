<script setup lang="ts">
import { HOOK_CARDS } from "~/constants/home";
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
      class="grid grid-cols-1 gap-4 [grid-auto-rows:19rem] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <article
        v-for="hook in HOOK_CARDS"
        :key="hook.name"
        class="group/card relative h-full"
      >
        <NuxtLink
          :to="hook.href"
          :aria-label="`View ${hook.name}`"
          class="absolute inset-0 z-20 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <div
          class="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors duration-300 contain-[paint] group-hover/card:border-border-strong"
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
              <div class="flex items-center gap-2">
                <h3
                  class="truncate font-display text-[0.95rem] font-semibold tracking-normal text-foreground"
                >
                  {{ hook.name }}
                </h3>
              </div>
              <p
                class="mt-0.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground"
              >
                {{ hook.description }}
              </p>
            </div>
            <Icon
              name="lucide:arrow-up-right"
              class="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
              aria-hidden="true"
            />
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
