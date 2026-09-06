<script setup lang="ts">
import { useScrollPosition } from "@cermuel/hooks/vue";

const position = useScrollPosition();
</script>

<template>
  <p>{{ position.x }}, {{ position.y }}</p>
</template>
