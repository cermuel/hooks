import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { isBrowser } from "./core";

export function useInfiniteScroll<T>(loadMore: () => Promise<T[]>, options: IntersectionObserverInit = {}) {
  const target = ref<Element | null>(null);
  const items = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const load = async () => {
    loading.value = true;
    items.value = [...items.value, ...(await loadMore())];
    loading.value = false;
  };
  let observer: IntersectionObserver | undefined;
  onMounted(() => {
    if (!target.value || !isBrowser() || !("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !loading.value) void load();
    }, options);
    observer.observe(target.value);
  });
  onUnmounted(() => observer?.disconnect());
  return { ref: target, items, loading, load };
}
