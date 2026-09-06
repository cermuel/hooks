<script setup lang="ts">
import { ref } from "vue";
import { useElementSize } from "@cermuel/hooks/vue";

const target = ref<HTMLElement>();
const size = useElementSize(target);
</script>

<template>
  <div ref="target">{{ size.width }} x {{ size.height }}</div>
</template>
