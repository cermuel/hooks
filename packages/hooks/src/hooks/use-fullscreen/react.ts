import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useFullscreen(target?: MaybeTarget<Element>) {
  const [element, setElement] = useState<Element | null>(() => (isBrowser() ? document.fullscreenElement : null));
  const supported = isBrowser() && Boolean(document.documentElement.requestFullscreen);
  useEventListener("fullscreenchange", () => setElement(document.fullscreenElement), isBrowser() ? document : undefined);
  const enter = useCallback(async () => {
    const next = resolveTarget(target) ?? document.documentElement;
    await next.requestFullscreen?.();
  }, [target]);
  const exit = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
  }, []);
  return { supported, element, active: Boolean(element), enter, exit, toggle: () => (document.fullscreenElement ? exit() : enter()) };
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
