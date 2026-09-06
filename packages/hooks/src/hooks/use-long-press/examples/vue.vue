<script setup lang="ts">
import { ref } from "vue";
import { useLongPress } from "@cermuel/hooks/vue";

const pressed = ref(false);
const press = useLongPress(() => pressed.value = true);
</script>

<template>
  <button type="button" v-bind="press.bind">{{ pressed ? "Pressed" : "Hold" }}</button>
</template>
