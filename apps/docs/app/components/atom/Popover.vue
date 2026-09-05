<script setup lang="ts">
type PopoverSide = "top" | "bottom";
type PopoverAlign = "start" | "center" | "end";

const props = withDefaults(
  defineProps<{
    side?: PopoverSide;
    align?: PopoverAlign;
    label?: string;
    triggerLabel?: string;
    triggerIcon?: string;
    triggerClass?: string;
    contentClass?: string;
  }>(),
  {
    side: "bottom",
    align: "center",
    label: undefined,
    triggerLabel: undefined,
    triggerIcon: undefined,
    triggerClass: undefined,
    contentClass: undefined,
  }
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const panelId = `popover-${useId()}`;

const panelClasses = computed(() => [
  "absolute z-40 min-w-64 rounded-2xl bg-popover p-4 text-sm text-popover-foreground border",
  "transition-[opacity,transform,filter] duration-150 ease-out",
  open.value
    ? "pointer-events-auto opacity-100 blur-0"
    : "pointer-events-none opacity-0 blur-sm",
  props.side === "top" ? "bottom-full mb-2" : "top-full mt-2",
  {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }[props.align],
  props.contentClass,
  open.value
    ? props.side === "top"
      ? "-translate-y-1"
      : "translate-y-1"
    : "translate-y-0",
]);

const triggerClasses = [
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-5 text-sm font-medium text-foreground shadow-sm outline-none",
  "transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out",
  "hover:border-border-strong hover:bg-card active:scale-[0.96]",
  "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
];

const resolvedTriggerClasses = computed(
  () => props.triggerClass ?? triggerClasses
);

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) {
    close();
  }
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    close();
  }
}

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown);
  document.addEventListener("keydown", onDocumentKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  document.removeEventListener("keydown", onDocumentKeydown);
});
</script>

<template>
  <span ref="root" class="relative inline-flex">
    <button
      type="button"
      :class="resolvedTriggerClasses"
      :aria-label="label ?? triggerLabel"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="toggle"
    >
      <slot name="trigger" :open="open">
        <Icon
          v-if="triggerIcon"
          :name="triggerIcon"
          class="size-4"
          aria-hidden="true"
        />
        <span>{{ triggerLabel }}</span>
      </slot>
    </button>

    <span :id="panelId" role="dialog" :aria-label="label" :class="panelClasses">
      <slot :open="open" :close="close" />
    </span>
  </span>
</template>
