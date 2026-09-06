<script setup lang="ts">
import { usePagination } from "@cermuel/hooks/vue";

const pagination = usePagination(120, { pageSize: 10 });
</script>

<template>
  <button type="button" @click="pagination.next">Next</button>
</template>
