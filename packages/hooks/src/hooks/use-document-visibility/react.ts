import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useDocumentVisibility(): boolean {
  const get = () => (isBrowser() ? document.visibilityState === "visible" : true);
  const [visible, setVisible] = useState(get);
  useEventListener("visibilitychange", () => setVisible(get()), isBrowser() ? document : undefined);
  return visible;
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
