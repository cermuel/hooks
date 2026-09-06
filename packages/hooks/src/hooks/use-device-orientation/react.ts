import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultTarget, isBrowser, resolveTarget, type DeviceOrientationSnapshot, type MaybeTarget } from "./core";

export function useDeviceOrientation(): DeviceOrientationSnapshot {
  const [state, setState] = useState<DeviceOrientationSnapshot>({ supported: isBrowser() && "DeviceOrientationEvent" in window, alpha: null, beta: null, gamma: null, absolute: false });
  useEventListener("deviceorientation", (event) => {
    const orientationEvent = event as DeviceOrientationEvent;
    setState({ supported: true, alpha: orientationEvent.alpha, beta: orientationEvent.beta, gamma: orientationEvent.gamma, absolute: orientationEvent.absolute });
  });
  return state;
}

function useEventListener(type: string, listener: EventListener, target?: MaybeTarget, options?: AddEventListenerOptions): void {
  const saved = useStableCallback(listener);
  useEffect(() => {
    const element = resolveTarget(target) ?? getDefaultTarget();
    if (!element) return;
    element.addEventListener(type, saved, options);
    return () => element.removeEventListener(type, saved, options);
  }, [options, saved, target, type]);
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
