<script setup lang="ts">
import { useClipboard } from "@cermuel/hooks/vue";

const { text, copy } = useClipboard();
</script>

<template>
  <button type="button" @click="copy('Hello')">{{ text || "Copy" }}</button>
</template>
