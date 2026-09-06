<script setup lang="ts">
import { useSyncedState } from "@cermuel/hooks/vue";

const value = useSyncedState("shared", "");
</script>

<template>
  <input v-model="value.value">
</template>
