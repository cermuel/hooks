<script setup lang="ts">
import { useGeolocation } from "@cermuel/hooks/vue";

const location = useGeolocation();
</script>

<template>
  <p>{{ location.supported ? location.permission : "Unsupported" }}</p>
</template>
