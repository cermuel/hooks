<script setup lang="ts">
import { useWebSocket } from "@cermuel/hooks/vue";

const socket = useWebSocket("wss://example.com");
</script>

<template>
  <p>{{ socket.status }}</p>
</template>
