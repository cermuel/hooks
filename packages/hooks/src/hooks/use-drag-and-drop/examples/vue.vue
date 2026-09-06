<script setup lang="ts">
import { useDragAndDrop } from "@cermuel/hooks/vue";

const drag = useDragAndDrop(['a', 'b']);
</script>

<template>
  <p>{{ drag.items.join(', ') }}</p>
</template>
