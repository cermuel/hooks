<script setup lang="ts">
import { useInfiniteScroll } from "@cermuel/hooks/vue";

async function loadMore() { return ['next']; }
const loader = useInfiniteScroll(loadMore);
</script>

<template>
  <div ref="loader.ref">{{ loader.loading ? "Loading" : "Ready" }}</div>
</template>
