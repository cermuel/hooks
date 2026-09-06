<script setup lang="ts">
type ButtonVariant = "default" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonType = "button" | "submit" | "reset";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

const props = withDefaults(
  defineProps<{
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: string;
    rightIcon?: string;
    href?: string;
    to?: string;
    type?: ButtonType;
    disabled?: boolean;
    iconOnly?: boolean;
    static?: boolean;
    pressScale?: number;
    ripple?: boolean;
    ariaLabel?: string;
    external?: boolean;
    handleMobile?: boolean;
  }>(),
  {
    variant: "default",
    size: "md",
    type: "button",
    iconOnly: false,
    static: false,
    pressScale: 0.93,
    ripple: false,
    leftIcon: undefined,
    rightIcon: undefined,
    href: undefined,
    to: undefined,
    ariaLabel: undefined,
    external: undefined,
    handleMobile: false,
  }
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const pressed = ref(false);
const hoverCapable = ref(false);
const ripples = ref<Ripple[]>([]);
const nextRippleId = ref(0);

const component = computed(() => {
  if (props.to) {
    return resolveComponent("NuxtLink");
  }

  if (props.href) {
    return "a";
  }

  return "button";
});

const isLink = computed(() => Boolean(props.href || props.to));

const buttonClasses = computed(() => [
  "group relative isolate inline-flex shrink-0 select-none items-center justify-center overflow-hidden font-medium tracking-normal outline-none",
  "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-200 ease-out",
  "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:pointer-events-none disabled:opacity-45",
  props.disabled && isLink.value ? "pointer-events-none opacity-45" : "",
  !props.disabled && !props.static ? "active:scale-[0.96]" : "",
  props.iconOnly
    ? {
        sm: "size-8 rounded-lg",
        md: "size-9 rounded-2xl",
        lg: "size-11 rounded-2xl",
      }[props.size]
    : {
        sm: "h-7.5 gap-1.5 rounded-full px-3 text-xs",
        md: "h-9 gap-2 rounded-full px-4 text-sm",
        lg: "h-12 gap-2 rounded-full px-6 text-base",
      }[props.size],
  {
    default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
    secondary:
      "border border-border bg-card/60 text-foreground shadow-sm hover:border-border-strong hover:bg-card",
    ghost:
      "border border-transparent bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-foreground",
  }[props.variant],
]);

const buttonStyle = computed(() => {
  if (!pressed.value || props.disabled || props.static) {
    return undefined;
  }

  return {
    transform: `scale(${props.pressScale})`,
  };
});

const iconClasses = computed(
  () =>
    ({
      sm: "size-3.5",
      md: "size-4",
      lg: "size-4",
    })[props.size]
);

const leftIconClasses = computed(() => [
  "relative z-10",
  !props.static ? "transition-transform duration-200 ease-out" : "",
  iconClasses.value,
]);

const rightIconClasses = computed(() => [
  "relative z-10",
  !props.static
    ? "transition-transform duration-200 ease-out group-hover:translate-x-0.5"
    : "",
  iconClasses.value,
]);

const linkTarget = computed(() => {
  if (!props.href) {
    return undefined;
  }

  return (props.external ?? props.href.startsWith("http"))
    ? "_blank"
    : undefined;
});

const linkRel = computed(() =>
  linkTarget.value === "_blank" ? "noreferrer" : undefined
);

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit("click", event);
}

function onPointerEnter(event: PointerEvent) {
  hoverCapable.value =
    event.pointerType === "mouse" || event.pointerType === "pen";
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled) {
    return;
  }

  pressed.value = true;

  if (
    !props.ripple ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;

  ripples.value.push({
    id: nextRippleId.value,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    size,
  });
  nextRippleId.value += 1;
}

function releasePress() {
  pressed.value = false;
}

function removeRipple(id: number) {
  ripples.value = ripples.value.filter((ripple) => ripple.id !== id);
}
</script>

<template>
  <component
    :is="component"
    :to="to"
    :href="href"
    :type="isLink ? undefined : type"
    :target="linkTarget"
    :rel="linkRel"
    :disabled="!isLink ? disabled : undefined"
    :aria-disabled="isLink && disabled ? 'true' : undefined"
    :aria-label="ariaLabel"
    :class="buttonClasses"
    :style="buttonStyle"
    :data-hover-capable="hoverCapable || undefined"
    @click="onClick"
    @pointerenter="onPointerEnter"
    @pointerdown="onPointerDown"
    @pointerup="releasePress"
    @pointercancel="releasePress"
    @pointerleave="releasePress"
    @blur="releasePress"
  >
    <span
      v-for="ink in ripples"
      :key="ink.id"
      aria-hidden="true"
      class="pointer-events-none absolute rounded-full bg-current/20 atom-button-ripple"
      :style="{
        left: `${ink.x}px`,
        top: `${ink.y}px`,
        width: `${ink.size}px`,
        height: `${ink.size}px`,
      }"
      @animationend="removeRipple(ink.id)"
    />
    <Icon
      v-if="leftIcon"
      :name="leftIcon"
      :class="leftIconClasses"
      aria-hidden="true"
    />
    <span
      :class="[
        'relative z-10',
        handleMobile && 'max-sm:hidden',
        iconOnly ? 'sr-only' : undefined,
      ]"
      >{{ label }}</span
    >
    <Icon
      v-if="rightIcon"
      :name="rightIcon"
      :class="rightIconClasses"
      aria-hidden="true"
    />
  </component>
</template>
