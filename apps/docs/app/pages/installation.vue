<script setup lang="ts">
const packageManagers = [
  { name: "npm", command: "npm install @cermuel/hooks" },
  { name: "pnpm", command: "pnpm add @cermuel/hooks" },
  { name: "yarn", command: "yarn add @cermuel/hooks" },
  { name: "bun", command: "bun add @cermuel/hooks" },
];

const defaultInstallCommand = "npm install @cermuel/hooks";
const activePackageManager = ref("npm");

const activeInstallCommand = computed(
  () =>
    packageManagers.find(
      (manager) => manager.name === activePackageManager.value
    )?.command ?? defaultInstallCommand
);
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-20 pt-28">
    <p
      class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
    >
      Installation
    </p>
    <h1
      class="mt-3 font-display text-4xl font-semibold leading-tight tracking-normal text-foreground md:text-5xl"
    >
      Install Hooks
    </h1>
    <p
      class="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground"
    >
      Add the package once, then import the React hook or Vue composable entry
      that matches your app.
    </p>

    <div class="mt-10 overflow-hidden rounded-3xl border border-border bg-card">
      <div class="flex border-b border-border p-2">
        <button
          v-for="manager in packageManagers"
          :key="manager.name"
          type="button"
          :class="[
            'min-h-8 rounded-2xl px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            activePackageManager === manager.name
              ? 'bg-background text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="activePackageManager = manager.name"
        >
          {{ manager.name }}
        </button>
      </div>
      <div class="p-2">
        <AtomCodeBlock :code="`$ ${activeInstallCommand}`" command />
      </div>
    </div>
  </main>
</template>
