<script setup lang="ts">
import { useMediaQuery } from "@cermuel/hooks/vue";

const wide = useMediaQuery("(min-width: 768px)");
</script>

<template>
  <p>{{ wide ? "Wide" : "Compact" }}</p>
</template>
