import { onMounted, onUnmounted, ref } from "vue";

export function useIdle(timeout = 60000, events = ["mousemove", "keydown", "pointerdown", "scroll", "touchstart"]) {
  const idle = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const reset = () => {
    clearTimeout(timer);
    idle.value = false;
    timer = setTimeout(() => { idle.value = true; }, timeout);
  };
  onMounted(() => {
    reset();
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }));
  });
  onUnmounted(() => {
    clearTimeout(timer);
    events.forEach((event) => window.removeEventListener(event, reset));
  });
  return { idle, reset };
}
