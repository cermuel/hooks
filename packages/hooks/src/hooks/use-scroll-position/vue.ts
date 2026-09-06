import { onMounted, onUnmounted, reactive, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useScrollPosition(target?: MaybeTarget<Element | Window>) {
  const position = reactive({ x: 0, y: 0 });
  const read = () => {
    const element = resolveTarget(target);
    if (!isBrowser()) return;
    if (!element || element === window) Object.assign(position, { x: window.scrollX, y: window.scrollY });
    else Object.assign(position, { x: (element as Element).scrollLeft, y: (element as Element).scrollTop });
  };
  useEventListener("scroll", read, target);
  onMounted(read);
  return position;
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
