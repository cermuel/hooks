<script setup lang="ts">
const { nextTheme, theme, toggleTheme } = useTheme();
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl backdrop-saturate-150"
  >
    <div
      class="relative mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4"
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

        <nav class="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          <NuxtLink
            to="/installation"
            class="rounded-md px-1.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:px-3"
          >
            Installation
          </NuxtLink>
          <NuxtLink
            to="/usage"
            class="rounded-md px-1.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:px-3"
          >
            Usage
          </NuxtLink>
          <NuxtLink
            to="/hooks"
            class="rounded-md px-1.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:px-3"
          >
            Hooks
          </NuxtLink>
        </nav>
      </div>

      <nav class="flex items-center gap-2" aria-label="Actions">
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
        />

        <AtomButton
          label="Contribute"
          href="https://github.com/cermuel/hooks/blob/main/CONTRIBUTING.md"
          size="sm"
          left-icon="lucide:git-pull-request-arrow"
          external
          static
        />
      </nav>
    </div>
  </header>
</template>
