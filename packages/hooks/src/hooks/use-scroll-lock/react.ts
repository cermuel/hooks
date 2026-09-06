import { useEffect, useState } from "react";
import { isBrowser } from "./core";

export function useScrollLock(initial = false) {
  const [locked, setLocked] = useState(initial);
  useEffect(() => {
    if (!isBrowser() || !locked) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [locked]);
  return { locked, lock: () => setLocked(true), unlock: () => setLocked(false), toggle: () => setLocked((value) => !value) };
}
