import { computed, onMounted, onUnmounted, reactive, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useBreakpoint<T extends string>(breakpoints: Record<T, number>, fallback?: T) {
  const size = useWindowSize();
  return computed(() => (Object.entries(breakpoints) as Array<[T, number]>).sort((a, b) => b[1] - a[1]).find(([, width]) => size.width >= width)?.[0] ?? fallback);
}

function useWindowSize() {
  const size = reactive({ width: isBrowser() ? window.innerWidth : 0, height: isBrowser() ? window.innerHeight : 0 });
  useEventListener("resize", () => { size.width = window.innerWidth; size.height = window.innerHeight; });
  return size;
}

function useEventListener(type: string, listener: EventListener, target?: MaybeTarget, options?: AddEventListenerOptions): void {
  const saved = useStableCallback(listener);
  let cleanup: (() => void) | undefined;
  onMounted(() => {
    const element = resolveTarget(target) ?? getDefaultTarget();
    if (!element) return;
    element.addEventListener(type, saved, options);
    cleanup = () => element.removeEventListener(type, saved, options);
  });
  onUnmounted(() => cleanup?.());
}

function useStableCallback<T extends (...args: any[]) => any>(callback: MaybeRefOrGetter<T>): T {
  return ((...args: Parameters<T>) => toValue(callback)(...args)) as T;
}
