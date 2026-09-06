import {
  onMounted,
  onUnmounted,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

import { createDebounceTimer, defaultDebounceDelay } from "./core";

export function useDebounce<T>(
  value: MaybeRefOrGetter<T>,
  delay = defaultDebounceDelay
): Ref<T> {
  const debouncedValue = shallowRef(toValue(value)) as Ref<T>;
  let cancelTimer: (() => void) | undefined;
  let stopWatch: (() => void) | undefined;

  onMounted(() => {
    stopWatch = watch(
      () => toValue(value),
      (nextValue) => {
        cancelTimer?.();
        cancelTimer = createDebounceTimer(() => {
          debouncedValue.value = nextValue;
        }, delay);
      }
    );
  });

  onUnmounted(() => {
    cancelTimer?.();
    stopWatch?.();
  });

  return debouncedValue;
}
