<script setup lang="ts">
import { useOtpInput } from "@cermuel/hooks/vue";

const otp = useOtpInput(6);
</script>

<template>
  <p>{{ otp.value }}</p>
</template>
