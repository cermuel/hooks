<script setup lang="ts">
import { usePageFocus } from "@cermuel/hooks/vue";

const focused = usePageFocus();
</script>

<template>
  <p>{{ focused ? "Focused" : "Blurred" }}</p>
</template>
