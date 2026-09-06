<script setup lang="ts">
import { ref } from "vue";
import { usePrevious } from "@cermuel/hooks/vue";

const count = ref(0);
const previous = usePrevious(count);
</script>

<template>
  <button type="button" @click="count += 1">Previous: {{ previous ?? 0 }}</button>
</template>
