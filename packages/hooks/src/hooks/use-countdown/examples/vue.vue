<script setup lang="ts">
import { useCountdown } from "@cermuel/hooks/vue";

const countdown = useCountdown(10);
</script>

<template>
  <button type="button" @click="countdown.start">{{ countdown.remaining }}</button>
</template>
