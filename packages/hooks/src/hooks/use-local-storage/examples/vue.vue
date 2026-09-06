<script setup lang="ts">
import { useLocalStorage } from "@cermuel/hooks/vue";

const name = useLocalStorage("name", "Ada");
</script>

<template>
  <input v-model="name.value">
</template>
