import { computed, onMounted, onUnmounted, shallowRef, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useFullscreen(target?: MaybeTarget<Element>) {
  const element = shallowRef<Element | null>(isBrowser() ? document.fullscreenElement : null);
  const supported = isBrowser() && Boolean(document.documentElement.requestFullscreen);
  useEventListener("fullscreenchange", () => { element.value = document.fullscreenElement; }, isBrowser() ? document : undefined);
  const enter = async () => { await (resolveTarget(target) ?? document.documentElement).requestFullscreen?.(); };
  const exit = async () => { if (document.fullscreenElement) await document.exitFullscreen(); };
  return { supported, element, active: computed(() => Boolean(element.value)), enter, exit, toggle: () => document.fullscreenElement ? exit() : enter() };
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
