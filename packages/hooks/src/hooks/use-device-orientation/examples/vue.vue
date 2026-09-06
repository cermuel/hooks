<script setup lang="ts">
import { useDeviceOrientation } from "@cermuel/hooks/vue";

const orientation = useDeviceOrientation();
</script>

<template>
  <p>{{ orientation.alpha ?? 0 }}</p>
</template>
