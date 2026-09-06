import { onMounted, onUnmounted, ref, toValue, type MaybeRefOrGetter, type Ref } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useDocumentVisibility(): Ref<boolean> {
  const visible = ref(isBrowser() ? document.visibilityState === "visible" : true);
  useEventListener("visibilitychange", () => { visible.value = document.visibilityState === "visible"; }, isBrowser() ? document : undefined);
  return visible;
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
