<script setup lang="ts">
type PillTone = "neutral" | "accent" | "success" | "warning" | "danger";
type PillSize = "sm" | "md";

const props = withDefaults(
  defineProps<{
    label: string;
    tone?: PillTone;
    size?: PillSize;
    icon?: string;
  }>(),
  {
    tone: "neutral",
    size: "sm",
    icon: undefined,
  },
);

const pillClasses = computed(() => [
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border font-medium tracking-normal",
  "transition-[background-color,border-color,color] duration-150 ease-out",
  props.size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
  {
    neutral: "border-border bg-muted text-muted-foreground",
    accent: "border-accent/20 bg-accent/10 text-accent",
    success: "border-success/20 bg-success/10 text-success",
    warning: "border-warning/20 bg-warning/10 text-warning",
    danger: "border-danger/20 bg-danger/10 text-danger",
  }[props.tone],
]);
</script>

<template>
  <span :class="pillClasses">
    <Icon v-if="icon" :name="icon" class="size-3.5" aria-hidden="true" />
    {{ label }}
  </span>
</template>
