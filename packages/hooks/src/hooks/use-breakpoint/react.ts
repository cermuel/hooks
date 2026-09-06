import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useBreakpoint<T extends string>(breakpoints: Record<T, number>, fallback?: T): T | undefined {
  const size = useWindowSize();
  return useMemo(() => {
    return (Object.entries(breakpoints) as Array<[T, number]>).sort((a, b) => b[1] - a[1]).find(([, width]) => size.width >= width)?.[0] ?? fallback;
  }, [breakpoints, fallback, size.width]);
}

function useWindowSize() {
  const get = () => ({ width: isBrowser() ? window.innerWidth : 0, height: isBrowser() ? window.innerHeight : 0 });
  const [size, setSize] = useState(get);
  useEventListener("resize", () => setSize(get()));
  return size;
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
