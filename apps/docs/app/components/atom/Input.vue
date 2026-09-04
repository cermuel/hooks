<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    leftIcon?: string;
    rightIcon?: string;
    disabled?: boolean;
    required?: boolean;
    autocomplete?: string;
    ariaLabel?: string;
    error?: string | boolean;
    success?: boolean;
  }>(),
  {
    modelValue: "",
    id: undefined,
    name: undefined,
    label: undefined,
    placeholder: undefined,
    type: "text",
    leftIcon: undefined,
    rightIcon: undefined,
    autocomplete: undefined,
    ariaLabel: undefined,
    error: false,
    success: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const fallbackId = `input-${useId()}`;
const inputId = computed(() => props.id ?? fallbackId);
const hasError = computed(() => Boolean(props.error));
const errorMessage = computed(() =>
  typeof props.error === "string" ? props.error : undefined
);

function updateValue(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<template>
  <label
    :for="inputId"
    class="grid gap-1.5 text-sm font-medium text-foreground"
  >
    <span v-if="label" class="px-1">{{ label }}</span>
    <span class="group relative block">
      <Icon
        v-if="leftIcon"
        :name="leftIcon"
        class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-foreground"
        aria-hidden="true"
      />
      <input
        :id="inputId"
        :name="name"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :aria-label="label ? undefined : ariaLabel"
        :aria-invalid="hasError || undefined"
        :aria-describedby="errorMessage ? `${inputId}-error` : undefined"
        :class="[
          'h-11 w-full rounded-full border text-base leading-6 text-foreground caret-foreground outline-none',
          'placeholder:text-muted-foreground/60',
          'transition-[background-color,border-color,box-shadow,color] duration-200 ease-out',
          'hover:border-border-strong focus:border-border-strong',
          'disabled:cursor-not-allowed disabled:opacity-45',
          hasError ? 'border-danger ring ring-danger/25' : 'border-border',
          leftIcon ? 'pl-10' : 'pl-3.5',
          rightIcon || success ? 'pr-10' : 'pr-3.5',
        ]"
        @input="updateValue"
      >
      <Icon
        v-if="success"
        name="hugeicons:checkmark-circle-01"
        class="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-success"
        aria-hidden="true"
      />
      <Icon
        v-else-if="rightIcon"
        :name="rightIcon"
        class="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-foreground"
        aria-hidden="true"
      />
    </span>
    <span
      v-if="errorMessage"
      :id="`${inputId}-error`"
      role="alert"
      class="px-1 text-xs text-danger"
    >
      {{ errorMessage }}
    </span>
  </label>
</template>
