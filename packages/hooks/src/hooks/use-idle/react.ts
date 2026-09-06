import { useCallback, useEffect, useRef, useState } from "react";
import { isBrowser } from "./core";

export function useIdle(timeout = 60000, events = ["mousemove", "keydown", "pointerdown", "scroll", "touchstart"]) {
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reset = useCallback(() => {
    clearTimeout(timer.current);
    setIdle(false);
    timer.current = setTimeout(() => setIdle(true), timeout);
  }, [timeout]);
  useEffect(() => {
    if (!isBrowser()) return;
    reset();
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }));
    return () => {
      clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [events, reset]);
  return { idle, reset };
}
