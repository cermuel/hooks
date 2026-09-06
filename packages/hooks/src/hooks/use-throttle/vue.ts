import { onUnmounted, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";

import { defaultThrottleDelay, getThrottleWait } from "./core";

export function useThrottle<T>(value: MaybeRefOrGetter<T>, delay = defaultThrottleDelay): Ref<T> {
  const throttled = shallowRef(toValue(value)) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let last = 0;
  const stop = watch(() => toValue(value), (next) => {
    const remaining = getThrottleWait(last, delay);
    clearTimeout(timer);
    timer = setTimeout(() => {
      last = Date.now();
      throttled.value = next;
    }, remaining);
  });
  onUnmounted(() => { clearTimeout(timer); stop(); });
  return throttled;
}
