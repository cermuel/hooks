import { useCallback, useEffect, useRef, useState } from "react";
import { isBrowser } from "./core";

export function useInfiniteScroll<T, TElement extends Element = HTMLDivElement>(loadMore: () => Promise<T[]>, options: IntersectionObserverInit = {}) {
  const ref = useRef<TElement | null>(null);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    const next = await loadMore();
    setItems((value) => [...value, ...next]);
    setLoading(false);
  }, [loadMore]);
  useEffect(() => {
    const element = ref.current;
    if (!element || !isBrowser() || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !loading) void load();
    }, options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [load, loading, options]);
  return { ref, items, loading, load };
}
