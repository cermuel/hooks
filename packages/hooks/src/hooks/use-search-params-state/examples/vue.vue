<script setup lang="ts">
import { useSearchParamsState } from "@cermuel/hooks/vue";

const query = useSearchParamsState("q", "");
</script>

<template>
  <input v-model="query">
</template>
