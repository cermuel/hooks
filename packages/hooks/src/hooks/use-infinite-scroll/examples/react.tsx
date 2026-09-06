import { useInfiniteScroll } from "@cermuel/hooks/react";

export function useInfiniteScrollExample() {
  async function loadMore() { return ['next']; }
  const loader = useInfiniteScroll(loadMore);

  return <div ref={loader.ref}>{loader.loading ? "Loading" : "Ready"}</div>;
}
