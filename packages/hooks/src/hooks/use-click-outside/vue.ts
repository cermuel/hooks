import { onMounted, onUnmounted, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useClickOutside<T extends Element>(target: MaybeTarget<T>, handler: (event: PointerEvent) => void) {
  useEventListener("pointerdown", (event) => {
    const element = resolveTarget(target);
    if (element && !element.contains((event as PointerEvent).target as Node)) handler(event as PointerEvent);
  }, isBrowser() ? document : undefined);
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
