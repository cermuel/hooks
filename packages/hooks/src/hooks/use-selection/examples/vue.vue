<script setup lang="ts">
import { useSelection } from "@cermuel/hooks/vue";

const selection = useSelection(['a', 'b', 'c']);
</script>

<template>
  <p>{{ selection.selected.size }} selected</p>
</template>
