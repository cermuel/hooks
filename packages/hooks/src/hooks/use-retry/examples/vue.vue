<script setup lang="ts">
import { useRetry } from "@cermuel/hooks/vue";

async function saveUser() { return true; }
const retry = useRetry(saveUser);
</script>

<template>
  <button type="button" @click="retry.run">Save</button>
</template>
