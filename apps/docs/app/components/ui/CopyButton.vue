<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: string;
    label?: string;
    copiedLabel?: string;
  }>(),
  {
    label: "Copy",
    copiedLabel: "Copied",
  }
);

const { copied, copy } = useCopy();

const buttonLabel = computed(() =>
  copied.value ? props.copiedLabel : props.label
);

const labelCharacters = computed(() => buttonLabel.value.split(""));

function copyValue() {
  void copy(props.value);
}
</script>

<template>
  <button
    type="button"
    :aria-label="copied ? copiedLabel : label"
    :data-copied="copied || undefined"
    class="group/copy inline-flex h-7 w-max shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-transparent px-2 text-xs font-medium text-foreground outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-ou bg-primary/5 hover:bg-primary/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96] data-[copied=true]:text-foreground"
    @click="copyValue"
  >
    <span class="relative grid size-3.5 place-items-center" aria-hidden="true">
      <Icon
        name="lucide:copy"
        class="col-start-1 row-start-1 size-3.5 transition-[opacity,transform,filter] duration-200 ease-out group-data-[copied=true]/copy:-translate-y-2 group-data-[copied=true]/copy:scale-90 group-data-[copied=true]/copy:opacity-0 group-data-[copied=true]/copy:blur-[2px]"
      />
      <Icon
        name="lucide:check"
        class="col-start-1 row-start-1 size-3.5 translate-y-2 scale-90 opacity-0 blur-[2px] transition-[opacity,transform,filter] duration-200 ease-out group-data-[copied=true]/copy:translate-y-0 group-data-[copied=true]/copy:scale-100 group-data-[copied=true]/copy:opacity-100 group-data-[copied=true]/copy:blur-none"
      />
    </span>
    <span
      :key="buttonLabel"
      class="copy-button-label relative inline-flex min-w-10 justify-center"
      aria-hidden="true"
    >
      <span
        v-for="(character, index) in labelCharacters"
        :key="`${buttonLabel}-${index}-${character}`"
        class="copy-button-character"
        :style="{ '--copy-character-delay': `${index * 18}ms` }"
      >
        {{ character }}
      </span>
    </span>
  </button>
</template>

<style scoped>
.copy-button-character {
  animation: copy-character-in 240ms var(--ease-out) both;
  animation-delay: var(--copy-character-delay);
}

@keyframes copy-character-in {
  from {
    opacity: 0;
    filter: blur(2px);
    transform: translateY(45%) scale(0.96);
  }

  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .copy-button-character {
    animation: none;
  }
}
</style>
