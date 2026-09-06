<script setup lang="ts">
import { ref } from "vue";
import { useUnsavedChanges } from "@cermuel/hooks/vue";

const dirty = ref(false);
useUnsavedChanges(dirty);
</script>

<template>
  <button type="button" @click="dirty = true">{{ dirty ? "Unsaved" : "Saved" }}</button>
</template>
