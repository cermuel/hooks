import { onUnmounted, ref, watch } from "vue";

import {
  getNextCountdownValue,
  resolveCountdownInterval,
  resolveCountdownSeconds,
  type CountdownOptions,
} from "./core";

export function useCountdown(initialSeconds: number, options: CountdownOptions = {}) {
  const remaining = ref(resolveCountdownSeconds(initialSeconds));
  const interval = useInterval(() => {
    remaining.value = getNextCountdownValue(remaining.value);
    if (remaining.value === 0) {
      interval.stop();
      options.onComplete?.();
    }
  }, resolveCountdownInterval(options.interval));
  return { remaining, running: interval.running, start: interval.start, pause: interval.stop, reset: (seconds = initialSeconds) => { remaining.value = resolveCountdownSeconds(seconds); interval.stop(); } };
}

function useInterval(callback: () => void, delay: number, options: { immediate?: boolean; autoStart?: boolean } = {}) {
  const running = ref(Boolean(options.autoStart));
  let id: ReturnType<typeof setInterval> | undefined;
  const stopTimer = () => { clearInterval(id); id = undefined; };
  const start = () => {
    if (id) return;
    running.value = true;
    if (options.immediate) callback();
    id = setInterval(callback, Math.max(0, delay));
  };
  const stop = () => { running.value = false; stopTimer(); };
  watch(running, (active) => active ? start() : stopTimer(), { immediate: true });
  onUnmounted(stopTimer);
  return { running, start, stop, toggle: () => running.value ? stop() : start() };
}
