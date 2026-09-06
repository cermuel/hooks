<script setup lang="ts">
import { ref } from "vue";
import { useClickOutside } from "@cermuel/hooks/vue";

const target = ref<HTMLElement>();
const open = ref(true);
useClickOutside(target, () => open.value = false);
</script>

<template>
  <div ref="target">{{ open ? "Open" : "Closed" }}</div>
</template>
