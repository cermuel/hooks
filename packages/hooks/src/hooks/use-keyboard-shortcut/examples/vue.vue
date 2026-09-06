<script setup lang="ts">
import { ref } from "vue";
import { useKeyboardShortcut } from "@cermuel/hooks/vue";

const open = ref(false);
useKeyboardShortcut("mod+k", () => open.value = true);
</script>

<template>
  <p>{{ open ? "Open" : "Closed" }}</p>
</template>
