<script setup lang="ts">
import { ref } from "vue";
import { useDebounce } from "@cermuel/hooks/vue";

const query = ref("");
const debouncedQuery = useDebounce(query, 300);
</script>

<template>
  <label>
    Search
    <input v-model="query">
    <span>Debounced value: {{ debouncedQuery }}</span>
  </label>
</template>
