<script setup lang="ts">
import { ref } from "vue";
import { useThrottle } from "@cermuel/hooks/vue";

const search = ref("");
const value = useThrottle(search, 300);
</script>

<template>
  <label>
    <input v-model="search">
    {{ value }}
  </label>
</template>
