<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";

type TabVariant = "pill" | "line";

type TabItem = {
  label: string;
  value: string;
  icon?: string;
};

const props = withDefaults(
  defineProps<{
    items: TabItem[];
    modelValue?: string;
    variant?: TabVariant;
    ariaLabel?: string;
  }>(),
  {
    modelValue: undefined,
    variant: "pill",
    ariaLabel: "Tabs",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const root = ref<HTMLElement | null>(null);
const tabRefs = ref<HTMLButtonElement[]>([]);
const indicator = ref({
  left: 0,
  width: 0,
});

const activeValue = computed(() => props.modelValue ?? props.items[0]?.value);
const activeIndex = computed(() =>
  props.items.findIndex((item) => item.value === activeValue.value)
);

const listClasses = computed(() => [
  "relative inline-flex items-center",
  props.variant === "pill"
    ? "gap-1 rounded-full bg-card/70 p-1"
    : "gap-1 border-b border-border",
]);

const indicatorClasses = computed(() => [
  "pointer-events-none absolute transition-[transform,width,opacity] duration-300 ease-out",
  props.variant === "pill"
    ? "inset-y-1 rounded-full bg-primary shadow-sm"
    : "-bottom-px h-px bg-primary",
  indicator.value.width > 0 ? "opacity-100" : "opacity-0",
]);

const indicatorStyle = computed(() => ({
  width: `${indicator.value.width}px`,
  transform: `translateX(${indicator.value.left}px)`,
}));

function updateIndicator() {
  const activeTab = tabRefs.value[activeIndex.value];

  if (!root.value || !activeTab) {
    indicator.value = { left: 0, width: 0 };
    return;
  }

  const rootRect = root.value.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();

  indicator.value = {
    left: tabRect.left - rootRect.left,
    width: tabRect.width,
  };
}

function setActive(value: string) {
  emit("update:modelValue", value);
}

function setTabRef(
  element: Element | ComponentPublicInstance | null,
  index: number
) {
  if (element instanceof HTMLButtonElement) {
    tabRefs.value[index] = element;
  }
}

function focusTab(index: number) {
  tabRefs.value[index]?.focus();
}

function onKeydown(event: KeyboardEvent, index: number) {
  const lastIndex = props.items.length - 1;
  let nextIndex = index;

  if (event.key === "ArrowRight") {
    nextIndex = index === lastIndex ? 0 : index + 1;
  } else if (event.key === "ArrowLeft") {
    nextIndex = index === 0 ? lastIndex : index - 1;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = lastIndex;
  } else {
    return;
  }

  event.preventDefault();
  const nextValue = props.items[nextIndex]?.value;

  if (nextValue) {
    setActive(nextValue);
    focusTab(nextIndex);
  }
}

watch(
  () => [activeValue.value, props.variant, props.items.length],
  async () => {
    await nextTick();
    updateIndicator();
  }
);

onMounted(async () => {
  await nextTick();
  updateIndicator();
  window.addEventListener("resize", updateIndicator);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIndicator);
});
</script>

<template>
  <div ref="root" role="tablist" :aria-label="ariaLabel" :class="listClasses">
    <span
      :class="indicatorClasses"
      :style="indicatorStyle"
      aria-hidden="true"
    />
    <button
      v-for="(item, index) in items"
      :id="`tab-${item.value}`"
      :key="item.value"
      :ref="(element) => setTabRef(element, index)"
      type="button"
      role="tab"
      :aria-selected="activeValue === item.value"
      :aria-controls="`panel-${item.value}`"
      :tabindex="activeValue === item.value ? 0 : -1"
      :class="[
        'relative z-10 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium outline-none',
        'transition-[color,box-shadow,opacity,transform] duration-200 ease-out',
        'focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'active:scale-[0.96]',
        variant === 'pill'
          ? activeValue === item.value
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
          : activeValue === item.value
            ? 'rounded-b-none text-foreground'
            : 'rounded-b-none text-muted-foreground hover:text-foreground',
      ]"
      @click="setActive(item.value)"
      @keydown="onKeydown($event, index)"
    >
      <Icon
        v-if="item.icon"
        :name="item.icon"
        class="size-4"
        aria-hidden="true"
      />
      {{ item.label }}
    </button>
  </div>
</template>
