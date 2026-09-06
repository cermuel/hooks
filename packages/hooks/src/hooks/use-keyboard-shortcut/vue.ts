import { onMounted, onUnmounted, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, matchesShortcut, resolveTarget, type MaybeTarget } from "./core";

export function useKeyboardShortcut(shortcut: string, handler: (event: KeyboardEvent) => void, options: { enabled?: MaybeRefOrGetter<boolean>; preventDefault?: boolean; target?: MaybeTarget } = {}) {
  useEventListener("keydown", (event) => {
    const keyboardEvent = event as KeyboardEvent;
    if (toValue(options.enabled) === false || !matchesShortcut(keyboardEvent, shortcut)) return;
    if (options.preventDefault !== false) keyboardEvent.preventDefault();
    handler(keyboardEvent);
  }, options.target);
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
