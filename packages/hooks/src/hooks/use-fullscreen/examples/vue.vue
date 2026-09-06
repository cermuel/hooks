<script setup lang="ts">
import { useFullscreen } from "@cermuel/hooks/vue";

const fullscreen = useFullscreen();
</script>

<template>
  <button type="button" @click="fullscreen.toggle">Toggle fullscreen</button>
</template>
