import { useCallback, useEffect, useRef, useState } from "react";

import { resolveIntervalDelay, type IntervalOptions } from "./core";

export function useInterval(callback: () => void, delay: number, options: IntervalOptions = {}) {
  const saved = useStableCallback(callback);
  const [running, setRunning] = useState(Boolean(options.autoStart));
  useEffect(() => {
    if (!running) return;
    if (options.immediate) saved();
    const id = setInterval(saved, resolveIntervalDelay(delay));
    return () => clearInterval(id);
  }, [delay, options.immediate, running, saved]);
  return { running, start: () => setRunning(true), stop: () => setRunning(false), toggle: () => setRunning((value) => !value) };
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
