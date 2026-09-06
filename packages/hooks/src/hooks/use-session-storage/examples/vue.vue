<script setup lang="ts">
import { useSessionStorage } from "@cermuel/hooks/vue";

const name = useSessionStorage("name", "Ada");
</script>

<template>
  <input v-model="name.value">
</template>
