<script setup lang="ts">
import { ref } from "vue";
import { useFocusTrap } from "@cermuel/hooks/vue";

const target = ref<HTMLElement>();
useFocusTrap(target, true);
</script>

<template>
  <div ref="target" tabindex="-1">Dialog</div>
</template>
