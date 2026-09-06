import { useEffect, useState } from "react";

import { createDebounceTimer, defaultDebounceDelay } from "./core";

export function useDebounce<T>(value: T, delay = defaultDebounceDelay): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () =>
      createDebounceTimer(() => {
        setDebouncedValue(value);
      }, delay),
    [value, delay]
  );

  return debouncedValue;
}
