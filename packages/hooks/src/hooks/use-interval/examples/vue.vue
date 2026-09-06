<script setup lang="ts">
import { ref } from "vue";
import { useInterval } from "@cermuel/hooks/vue";

const ticks = ref(0);
const { start, stop, running } = useInterval(() => ticks.value += 1, 1000);
</script>

<template>
  <button type="button" @click="running ? stop() : start()">{{ running ? "Stop" : `Start ${ticks}` }}</button>
</template>
