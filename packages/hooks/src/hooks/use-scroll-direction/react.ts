import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultTarget, isBrowser, resolveTarget, type Direction, type MaybeTarget } from "./core";

export function useScrollDirection(target?: MaybeTarget<Element | Window>): Direction {
  const position = useScrollPosition(target);
  const previous = usePrevious(position);
  if (!previous) return "none";
  const dx = position.x - previous.x;
  const dy = position.y - previous.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  if (dy === 0) return "none";
  return dy > 0 ? "down" : "up";
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function useScrollPosition(target?: MaybeTarget<Element | Window>) {
  const read = () => {
    const element = resolveTarget(target);
    if (!isBrowser()) return { x: 0, y: 0 };
    if (!element || element === window) return { x: window.scrollX, y: window.scrollY };
    return { x: (element as Element).scrollLeft, y: (element as Element).scrollTop };
  };
  const [position, setPosition] = useState(read);
  useEventListener("scroll", () => setPosition(read()), target);
  return position;
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
