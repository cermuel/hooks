import { ref, watch } from "vue";
import { isBrowser } from "./core";

export function useSearchParamsState(key: string, initialValue = "") {
  const read = () => isBrowser() ? new URLSearchParams(window.location.search).get(key) ?? initialValue : initialValue;
  const value = ref(read());
  watch(value, (next) => {
    if (!isBrowser()) return;
    const url = new URL(window.location.href);
    if (next) url.searchParams.set(key, next);
    else url.searchParams.delete(key);
    history.replaceState(history.state, "", url);
  });
  return value;
}
