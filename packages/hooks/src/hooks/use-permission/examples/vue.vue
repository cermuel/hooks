<script setup lang="ts">
import { usePermission } from "@cermuel/hooks/vue";

const camera = usePermission("camera" as PermissionName);
</script>

<template>
  <p>{{ camera.state }}</p>
</template>
