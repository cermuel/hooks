<script setup lang="ts">
import { INSTALL_COMMAND, PACKAGE_MANAGERS } from "~/constants/home";
const activePackageManager = ref("npm");
const activeInstallCommand = computed(
  () =>
    PACKAGE_MANAGERS.find(
      (manager) => manager.name === activePackageManager.value
    )?.command ?? INSTALL_COMMAND
);
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-border bg-card">
    <div
      class="flex items-center justify-between gap-2 border-b border-border p-2"
    >
      <div class="flex min-w-0">
        <button
          v-for="manager in PACKAGE_MANAGERS"
          :key="manager.name"
          type="button"
          :class="[
            'min-h-7.5 rounded-2xl px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            activePackageManager === manager.name
              ? 'bg-background text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="activePackageManager = manager.name"
        >
          {{ manager.name }}
        </button>
      </div>
      <SharedCopyButton :value="activeInstallCommand" />
    </div>

    <AtomCodeBlock
      :class="'rounded-t-none! bg-card! border-none!'"
      :code="`$ ${activeInstallCommand}`"
      command
    />
  </div>
</template>
