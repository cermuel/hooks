<script setup lang="ts">
const { nextTheme, theme, toggleTheme } = useTheme();
const route = useRoute();

const isHome = computed(() => route.path === "/");
</script>

<template>
  <header class="pointer-events-none fixed inset-x-0 top-3 z-40 px-3">
    <div
      class="pointer-events-auto w-full relative mx-auto flex h-12 max-w-full items-center justify-between gap-3 rounded-full border border-border bg-background/70 px-2.5 shadow-sm shadow-foreground/5 backdrop-blur-xl backdrop-saturate-150 transition-[width,max-width,background-color,border-color,box-shadow] duration-500 ease-in-out"
      :class="isHome ? 'md:max-w-3xl' : ' md:max-w-7xl'"
    >
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/"
          class="group flex items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span
            class="inline-flex size-6 items-center justify-center rounded-lg border border-border bg-card text-foreground"
          >
            <SharedShipIcon :size="16" />
          </span>
          <span>HOOKS</span>
        </NuxtLink>

        <nav class="hidden items-center gap-0.5" aria-label="Primary">
          <NuxtLink
            to="/hooks"
            class="rounded-md px-1.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:px-3"
          >
            Hooks
          </NuxtLink>
        </nav>
      </div>

      <nav class="flex items-center gap-2" aria-label="Actions">
        <LayoutHeaderSearch v-if="!isHome" />
        <AtomButton
          :label="`Switch to ${nextTheme} mode`"
          :left-icon="theme === 'dark' ? 'lucide:sun' : 'lucide:moon'"
          variant="secondary"
          size="sm"
          icon-only
          static
          class="rounded-full!"
          @click="toggleTheme"
        />
        <AtomButton
          label="GitHub"
          href="https://github.com/cermuel/hooks"
          variant="secondary"
          size="sm"
          left-icon="lucide:github"
          external
          static
          class="hidden sm:inline-flex"
          handle-mobile
        />

        <AtomButton
          label="Publish"
          to="/publish"
          size="sm"
          left-icon="lucide:git-pull-request-arrow"
          static
          class="hidden lg:inline-flex"
          handle-mobile
        />
      </nav>
    </div>
  </header>
</template>
