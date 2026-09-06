import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultTarget, getStorage, readStorageValue, resolveTarget, writeStorageValue, type MaybeTarget, type StorageOptions } from "./core";

type Setter<T> = (value: T | ((previous: T) => T)) => void;

export function useFormPersist<T>(key: string, values: T, options?: StorageOptions<T>) {
  const [, setStored, clear] = useLocalStorage(key, values, options);
  useEffect(() => setStored(values), [setStored, values]);
  return { clear };
}

function useLocalStorage<T>(key: string, initialValue: T, options?: StorageOptions<T>) {
  return useStorageState("local", key, initialValue, options);
}

function useStorageState<T>(kind: "local" | "session", key: string, initialValue: T, options: StorageOptions<T> = {}): [T, Setter<T>, () => void] {
  const serializer = options.serializer;
  const [value, setValue] = useState(() => readStorageValue(getStorage(kind), key, initialValue, serializer));
  const setStored = useCallback<Setter<T>>((next) => {
    setValue((previous) => {
      const resolved = typeof next === "function" ? (next as (value: T) => T)(previous) : next;
      writeStorageValue(getStorage(kind), key, resolved, serializer);
      return resolved;
    });
  }, [key, kind, serializer]);
  const remove = useCallback(() => {
    getStorage(kind)?.removeItem(key);
    setValue(initialValue);
  }, [initialValue, key, kind]);
  useEventListener("storage", (event) => {
    if ((event as StorageEvent).key === key) setValue(readStorageValue(getStorage(kind), key, initialValue, serializer));
  });
  return [value, setStored, remove];
}

function useEventListener(type: string, listener: EventListener, target?: MaybeTarget, options?: AddEventListenerOptions): void {
  const saved = useStableCallback(listener);
  useEffect(() => {
    const element = resolveTarget(target) ?? getDefaultTarget();
    if (!element) return;
    element.addEventListener(type, saved, options);
    return () => element.removeEventListener(type, saved, options);
  }, [options, saved, target, type]);
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
