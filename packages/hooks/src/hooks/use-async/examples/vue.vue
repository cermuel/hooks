<script setup lang="ts">
import { useAsync } from "@cermuel/hooks/vue";

async function fetchUser() { return { name: 'Ada' }; }
const request = useAsync(fetchUser);
</script>

<template>
  <button type="button" @click="request.execute">Load</button>
</template>
