<script setup lang="ts">
import { ref } from "vue";
import { useFormPersist } from "@cermuel/hooks/vue";

const draft = ref({ title: '' });
useFormPersist('contact-form', draft);
</script>

<template>
  <input v-model="draft.title">
</template>
