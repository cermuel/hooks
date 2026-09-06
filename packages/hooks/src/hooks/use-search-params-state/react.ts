import { useCallback, useState } from "react";
import { isBrowser } from "./core";

export function useSearchParamsState(key: string, initialValue = "") {
  const read = () => isBrowser() ? new URLSearchParams(window.location.search).get(key) ?? initialValue : initialValue;
  const [value, setValue] = useState(read);
  const set = useCallback((next: string) => {
    setValue(next);
    if (!isBrowser()) return;
    const url = new URL(window.location.href);
    if (next) url.searchParams.set(key, next);
    else url.searchParams.delete(key);
    history.replaceState(history.state, "", url);
  }, [key]);
  return [value, set] as const;
}
