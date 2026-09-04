<script setup lang="ts">
type TooltipSide = "top" | "bottom";

const props = withDefaults(
  defineProps<{
    text: string;
    side?: TooltipSide;
  }>(),
  {
    side: "top",
  },
);

const visible = ref(false);
const tooltipId = `tooltip-${useId()}`;

const tooltipClasses = computed(() => [
  "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground shadow-lg shadow-foreground/10",
  "transition-[opacity,transform,filter] duration-150 ease-out",
  visible.value ? "opacity-100 blur-0" : "opacity-0 blur-sm",
  props.side === "top"
    ? visible.value
      ? "bottom-full mb-2 -translate-y-1"
      : "bottom-full mb-2 translate-y-0"
    : visible.value
      ? "top-full mt-2 translate-y-1"
      : "top-full mt-2 translate-y-0",
]);

function show() {
  visible.value = true;
}

function hide() {
  visible.value = false;
}
</script>

<template>
  <span
    class="relative inline-flex"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <span :id="tooltipId" role="tooltip" :class="tooltipClasses">
      {{ text }}
    </span>
  </span>
</template>
