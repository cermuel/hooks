<script setup lang="ts">
import { useScrollLock } from "@cermuel/hooks/vue";

const { locked, lock, unlock } = useScrollLock();
</script>

<template>
  <button type="button" @click="locked ? unlock() : lock()">{{ locked ? "Unlock" : "Lock" }}</button>
</template>
