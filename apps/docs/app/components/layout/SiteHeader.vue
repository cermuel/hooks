<script setup lang="ts">
const colorMode = useColorMode();

const nextMode = computed(() => (colorMode.value === "dark" ? "light" : "dark"));

function toggleTheme() {
  colorMode.preference = nextMode.value;
}
</script>

<template>
  <header class="border-b border-border bg-background/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent">
        Cermuel Hooks
      </NuxtLink>

      <button
        type="button"
        class="inline-flex size-10 items-center justify-center rounded-md border border-border bg-card text-card-foreground transition hover:border-border-strong hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        :aria-label="`Switch to ${nextMode} mode`"
        @click="toggleTheme"
      >
        <Icon :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="size-5" />
      </button>
    </div>
  </header>
</template>
