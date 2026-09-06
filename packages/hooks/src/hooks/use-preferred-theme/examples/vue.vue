<script setup lang="ts">
import { usePreferredTheme } from "@cermuel/hooks/vue";

const theme = usePreferredTheme();
</script>

<template>
  <p>{{ theme.theme }}</p>
</template>
