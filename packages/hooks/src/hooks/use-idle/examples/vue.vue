<script setup lang="ts">
import { useIdle } from "@cermuel/hooks/vue";

const idle = useIdle(60000);
</script>

<template>
  <p>{{ idle.idle ? "Idle" : "Active" }}</p>
</template>
