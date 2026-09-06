<script setup lang="ts">
import { ref } from "vue";
import { useAutosave } from "@cermuel/hooks/vue";

const draft = ref({ title: '' });
const autosave = useAutosave(draft, async () => undefined);
</script>

<template>
  <p>{{ autosave.status }}</p>
</template>
