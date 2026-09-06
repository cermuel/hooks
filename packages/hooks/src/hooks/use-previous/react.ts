import { useEffect, useRef } from "react";

import { getPreviousValue } from "./core";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  const previous = getPreviousValue(value, ref.current);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return previous;
}
