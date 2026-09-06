<script setup lang="ts">
import { ref } from "vue";
import { useEventListener } from "@cermuel/hooks/vue";

const count = ref(0);
useEventListener("resize", () => count.value += 1);
</script>

<template>
  <p>Resizes: {{ count }}</p>
</template>
