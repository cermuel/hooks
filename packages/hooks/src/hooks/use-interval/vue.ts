import { onUnmounted, ref, watch } from "vue";

import { resolveIntervalDelay, type IntervalOptions } from "./core";

export function useInterval(callback: () => void, delay: number, options: IntervalOptions = {}) {
  const running = ref(Boolean(options.autoStart));
  let id: ReturnType<typeof setInterval> | undefined;
  const stopTimer = () => { clearInterval(id); id = undefined; };
  const start = () => {
    if (id) return;
    running.value = true;
    if (options.immediate) callback();
    id = setInterval(callback, resolveIntervalDelay(delay));
  };
  const stop = () => { running.value = false; stopTimer(); };
  watch(running, (active) => active ? start() : stopTimer(), { immediate: true });
  onUnmounted(stopTimer);
  return { running, start, stop, toggle: () => running.value ? stop() : start() };
}
