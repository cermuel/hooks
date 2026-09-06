<script setup lang="ts">
import { usePolling } from "@cermuel/hooks/vue";

async function fetchUser() { return { name: 'Ada' }; }
const polling = usePolling(fetchUser, { interval: 5000 });
</script>

<template>
  <p>{{ polling.running ? "Polling" : "Paused" }}</p>
</template>
