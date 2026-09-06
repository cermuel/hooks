import { useCallback, useEffect, useRef } from "react";
import { type LongPressOptions } from "./core";

export function useLongPress(handler: () => void, options: LongPressOptions = {}) {
  const saved = useStableCallback(handler);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const start = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(saved, options.delay ?? 500);
  };
  const cancel = () => clearTimeout(timer.current);
  useEffect(() => cancel, []);
  return { bind: { onPointerDown: start, onPointerUp: cancel, onPointerLeave: cancel, onPointerCancel: cancel }, start, cancel };
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
