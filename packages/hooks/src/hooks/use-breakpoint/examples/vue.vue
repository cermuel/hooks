<script setup lang="ts">
import { useBreakpoint } from "@cermuel/hooks/vue";

const breakpoint = useBreakpoint({ sm: 640, md: 768, lg: 1024 });
</script>

<template>
  <p>{{ breakpoint }}</p>
</template>
