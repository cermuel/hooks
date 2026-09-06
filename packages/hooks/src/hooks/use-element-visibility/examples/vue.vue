<script setup lang="ts">
import { ref } from "vue";
import { useElementVisibility } from "@cermuel/hooks/vue";

const target = ref<HTMLElement>();
const visible = useElementVisibility(target);
</script>

<template>
  <div ref="target">{{ visible ? "Visible" : "Hidden" }}</div>
</template>
