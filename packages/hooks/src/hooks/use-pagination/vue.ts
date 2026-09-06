import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";
import { clamp, getPaginationRange, type PaginationOptions } from "./core";

export function usePagination(totalItems: MaybeRefOrGetter<number>, options: PaginationOptions = {}) {
  const pageSize = options.pageSize ?? 10;
  const page = ref(clamp(options.initialPage ?? 1, 1, Math.max(1, Math.ceil(toValue(totalItems) / pageSize))));
  const pageCount = computed(() => Math.max(1, Math.ceil(toValue(totalItems) / pageSize)));
  const setPage = (next: number) => { page.value = clamp(next, 1, pageCount.value); };
  return { page, pageSize, pageCount, range: computed(() => getPaginationRange(page.value, pageCount.value, options.siblingCount)), next: () => setPage(page.value + 1), previous: () => setPage(page.value - 1), setPage };
}
