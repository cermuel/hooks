import { onMounted, onUnmounted, ref } from "vue";
import { isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useElementVisibility(target: MaybeTarget<Element>, options?: IntersectionObserverInit) {
  const visible = ref(false);
  let observer: IntersectionObserver | undefined;
  onMounted(() => {
    const element = resolveTarget(target);
    if (!element || !isBrowser() || !("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver(([entry]) => { visible.value = Boolean(entry?.isIntersecting); }, options);
    observer.observe(element);
  });
  onUnmounted(() => observer?.disconnect());
  return visible;
}
