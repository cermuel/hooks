import { onMounted, onUnmounted, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, resolveTarget, type MaybeTarget } from "./core";

export function useFocusTrap<T extends HTMLElement>(target: MaybeTarget<T>, active: MaybeRefOrGetter<boolean> = true) {
  useEventListener("keydown", (event) => {
    if (!toValue(active) || (event as KeyboardEvent).key !== "Tab") return;
    const element = resolveTarget(target);
    if (!element) return;
    const items = Array.from(element.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex='-1'])"));
    const first = items[0];
    const last = items.at(-1);
    if (!first || !last) return;
    if ((event as KeyboardEvent).shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!(event as KeyboardEvent).shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, target);
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
