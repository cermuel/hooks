import { useState } from "react";
import { clamp, getPaginationRange, type PaginationOptions } from "./core";

export function usePagination(totalItems: number, options: PaginationOptions = {}) {
  const pageSize = options.pageSize ?? 10;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const [page, setPageState] = useState(clamp(options.initialPage ?? 1, 1, pageCount));
  const setPage = (next: number) => setPageState(clamp(next, 1, pageCount));
  return { page, pageSize, pageCount, range: getPaginationRange(page, pageCount, options.siblingCount), next: () => setPage(page + 1), previous: () => setPage(page - 1), setPage };
}
