import { usePagination } from "@cermuel/hooks/react";

export function usePaginationExample() {
  const pagination = usePagination(120, { pageSize: 10 });

  return <button type="button" onClick={pagination.next}>Next</button>;
}
