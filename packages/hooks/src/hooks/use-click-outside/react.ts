import { useCallback, useEffect, useRef } from "react";
import { isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useClickOutside<T extends Element>(target: MaybeTarget<T>, handler: (event: PointerEvent | MouseEvent | TouchEvent) => void) {
  const saved = useStableCallback(handler);
  useEffect(() => {
    if (!isBrowser()) return;
    const onPointerDown = (event: PointerEvent) => {
      const element = resolveTarget(target);
      if (element && !element.contains(event.target as Node)) saved(event);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [saved, target]);
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
