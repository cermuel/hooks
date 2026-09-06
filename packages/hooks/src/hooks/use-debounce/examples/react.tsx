import { useDebounce } from "@cermuel/hooks/react";
import { useState } from "react";

export function UseDebounceExample() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  return (
    <label>
      Search
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <span>Debounced value: {debouncedQuery}</span>
    </label>
  );
}
