<script setup lang="ts">
import { useOnline } from "@cermuel/hooks/vue";

const online = useOnline();
</script>

<template>
  <p>You are currently {{ online ? "online" : "offline" }}.</p>
</template>
