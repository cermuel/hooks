import { useCallback, useEffect, useRef, useState } from "react";
import { type AutosaveStatus } from "./core";

export function useAutosave<T>(value: T, save: (value: T) => Promise<void> | void, delay = 500) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const saved = useStableCallback(save);
  useEffect(() => {
    const id = setTimeout(() => {
      setStatus("saving");
      Promise.resolve(saved(value)).then(() => { setStatus("saved"); setError(null); }).catch((reason) => { setStatus("error"); setError(reason instanceof Error ? reason : new Error("Autosave failed.")); });
    }, delay);
    return () => clearTimeout(id);
  }, [delay, saved, value]);
  return { status, error };
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
