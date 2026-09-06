<script setup lang="ts">
import { useDocumentVisibility } from "@cermuel/hooks/vue";

const visible = useDocumentVisibility();
</script>

<template>
  <p>{{ visible ? "Visible" : "Hidden" }}</p>
</template>
