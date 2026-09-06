import { useEffect, useRef, useState } from "react";

import { defaultThrottleDelay, getThrottleWait } from "./core";

export function useThrottle<T>(value: T, delay = defaultThrottleDelay): T {
  const [throttled, setThrottled] = useState(value);
  const last = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const remaining = getThrottleWait(last.current, delay);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      last.current = Date.now();
      setThrottled(value);
    }, remaining);
    return () => clearTimeout(timer.current);
  }, [value, delay]);
  return throttled;
}
