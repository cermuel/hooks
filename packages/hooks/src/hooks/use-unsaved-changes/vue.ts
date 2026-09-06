import { onMounted, onUnmounted, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, resolveTarget, type MaybeTarget } from "./core";

export function useUnsavedChanges(enabled: MaybeRefOrGetter<boolean>, message = "You have unsaved changes.") {
  useEventListener("beforeunload", (event) => {
    if (!toValue(enabled)) return;
    event.preventDefault();
    (event as BeforeUnloadEvent).returnValue = message;
  });
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
