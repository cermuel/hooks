import { useCallback, useEffect, useRef, useState } from "react";

import {
  getNextCountdownValue,
  resolveCountdownInterval,
  resolveCountdownSeconds,
  type CountdownOptions,
} from "./core";

export function useCountdown(initialSeconds: number, options: CountdownOptions = {}) {
  const [remaining, setRemaining] = useState(resolveCountdownSeconds(initialSeconds));
  const [running, setRunning] = useState(false);
  const complete = useStableCallback(options.onComplete ?? (() => {}));
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((value) => {
        const next = getNextCountdownValue(value);
        if (next === 0) {
          setRunning(false);
          complete();
        }
        return next;
      });
    }, resolveCountdownInterval(options.interval));
    return () => clearInterval(id);
  }, [complete, options.interval, running]);
  return { remaining, running, start: () => setRunning(true), pause: () => setRunning(false), reset: (seconds = initialSeconds) => { setRemaining(resolveCountdownSeconds(seconds)); setRunning(false); } };
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
