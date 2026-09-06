<script setup lang="ts">
import { useCookie } from "@cermuel/hooks/vue";

const cookie = useCookie("theme", "system");
</script>

<template>
  <button type="button" @click="cookie.set('dark')">{{ cookie.value }}</button>
</template>
