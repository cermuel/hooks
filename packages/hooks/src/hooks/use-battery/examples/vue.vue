<script setup lang="ts">
import { useBattery } from "@cermuel/hooks/vue";

const battery = useBattery();
</script>

<template>
  <p>{{ battery.level == null ? "Unknown" : battery.level }}</p>
</template>
