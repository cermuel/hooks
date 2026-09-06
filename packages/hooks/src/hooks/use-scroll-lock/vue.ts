import { onUnmounted, ref, watch } from "vue";
import { isBrowser } from "./core";

export function useScrollLock(initial = false) {
  const locked = ref(initial);
  let previousOverflow = "";
  let previousPadding = "";
  watch(locked, (active) => {
    if (!isBrowser()) return;
    if (active) {
      previousOverflow = document.body.style.overflow;
      previousPadding = document.body.style.paddingRight;
      const gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    } else {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    }
  }, { immediate: true });
  onUnmounted(() => { if (isBrowser()) { document.body.style.overflow = previousOverflow; document.body.style.paddingRight = previousPadding; } });
  return { locked, lock: () => { locked.value = true; }, unlock: () => { locked.value = false; }, toggle: () => { locked.value = !locked.value; } };
}
