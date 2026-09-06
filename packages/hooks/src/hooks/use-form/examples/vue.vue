<script setup lang="ts">
import { useForm } from "@cermuel/hooks/vue";

const form = useForm({ email: '' });
</script>

<template>
  <p>{{ form.dirty ? "Dirty" : "Clean" }}</p>
</template>
