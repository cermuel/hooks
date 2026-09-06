<script setup lang="ts">
import { useScrollDirection } from "@cermuel/hooks/vue";

const direction = useScrollDirection();
</script>

<template>
  <p>{{ direction }}</p>
</template>
