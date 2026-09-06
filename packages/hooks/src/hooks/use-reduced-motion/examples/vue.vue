<script setup lang="ts">
import { useReducedMotion } from "@cermuel/hooks/vue";

const reduced = useReducedMotion();
</script>

<template>
  <p>{{ reduced ? "Reduced" : "Animated" }}</p>
</template>
