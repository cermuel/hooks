import { useEffect, useRef, useState } from "react";
import { isBrowser } from "./core";

export function useElementVisibility<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || !isBrowser() || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);
  return { ref, visible };
}
