import { onMounted, onUnmounted, reactive, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type DeviceOrientationSnapshot, type MaybeTarget } from "./core";

export function useDeviceOrientation() {
  const state = reactive<DeviceOrientationSnapshot>({ supported: isBrowser() && "DeviceOrientationEvent" in window, alpha: null, beta: null, gamma: null, absolute: false });
  useEventListener("deviceorientation", (event) => Object.assign(state, { supported: true, alpha: (event as DeviceOrientationEvent).alpha, beta: (event as DeviceOrientationEvent).beta, gamma: (event as DeviceOrientationEvent).gamma, absolute: (event as DeviceOrientationEvent).absolute }));
  return state;
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
