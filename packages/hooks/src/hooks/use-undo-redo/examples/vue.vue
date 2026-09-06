<script setup lang="ts">
import { useUndoRedo } from "@cermuel/hooks/vue";

const history = useUndoRedo('draft');
</script>

<template>
  <button type="button" @click="history.undo">Undo</button>
</template>
