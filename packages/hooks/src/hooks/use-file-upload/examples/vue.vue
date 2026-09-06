<script setup lang="ts">
import { useFileUpload } from "@cermuel/hooks/vue";

const upload = useFileUpload({ accept: ['image/png'] });
</script>

<template>
  <p>{{ upload.files.length }} files</p>
</template>
