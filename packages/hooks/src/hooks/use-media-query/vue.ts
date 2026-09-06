import { onMounted, onUnmounted, ref, toValue, type MaybeRefOrGetter, type Ref } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(isBrowser() ? window.matchMedia(query).matches : false);
  useEventListener("change", (event) => { matches.value = (event as MediaQueryListEvent).matches; }, () => isBrowser() ? window.matchMedia(query) : undefined);
  return matches;
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
