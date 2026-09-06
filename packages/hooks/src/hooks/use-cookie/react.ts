import { useCallback, useState } from "react";
import { getCookie, removeCookie, setCookie, type CookieOptions } from "./core";

export function useCookie<T = string>(name: string, initialValue: T, options: CookieOptions<T> = {}) {
  const serializer = options.serializer ?? { read: (value: string) => value as T, write: (value: T) => String(value) };
  const [value, setValue] = useState<T>(() => {
    const raw = getCookie(name);
    return raw == null ? initialValue : serializer.read(raw);
  });
  const set = useCallback((next: T) => {
    setValue(next);
    setCookie(name, serializer.write(next), options as CookieOptions<string>);
  }, [name, options, serializer]);
  const remove = useCallback(() => {
    removeCookie(name, options.path);
    setValue(initialValue);
  }, [initialValue, name, options.path]);
  return { value, set, remove };
}
