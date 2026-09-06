import { useSearchParamsState } from "@cermuel/hooks/react";

export function useSearchParamsStateExample() {
  const [query, setQuery] = useSearchParamsState("q", "");

  return <input value={query} onChange={(event) => setQuery(event.target.value)} />;
}
