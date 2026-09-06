<script setup lang="ts">
import { useWindowSize } from "@cermuel/hooks/vue";

const size = useWindowSize();
</script>

<template>
  <p>{{ size.width }} x {{ size.height }}</p>
</template>
