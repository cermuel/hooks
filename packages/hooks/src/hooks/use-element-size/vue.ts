import { onMounted, onUnmounted, reactive } from "vue";
import { isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useElementSize(target: MaybeTarget<Element>) {
  const size = reactive({ width: 0, height: 0 });
  let observer: ResizeObserver | undefined;
  onMounted(() => {
    const element = resolveTarget(target);
    if (!element || !isBrowser() || !("ResizeObserver" in window)) return;
    observer = new ResizeObserver(([entry]) => {
      const box = entry?.contentRect;
      if (box) Object.assign(size, { width: box.width, height: box.height });
    });
    observer.observe(element);
  });
  onUnmounted(() => observer?.disconnect());
  return size;
}
