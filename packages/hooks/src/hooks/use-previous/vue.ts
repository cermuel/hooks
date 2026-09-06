import { shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";

import { getPreviousValue } from "./core";

export function usePrevious<T>(value: MaybeRefOrGetter<T>): Ref<T | undefined> {
  const previous = shallowRef<T>();
  watch(() => toValue(value), (_, oldValue) => {
    previous.value = getPreviousValue(toValue(value), oldValue);
  });
  return previous;
}
