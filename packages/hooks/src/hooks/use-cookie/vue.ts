import { shallowRef, type Ref } from "vue";
import { getCookie, removeCookie, setCookie, type CookieOptions } from "./core";

export function useCookie<T = string>(name: string, initialValue: T, options: CookieOptions<T> = {}) {
  const serializer = options.serializer ?? { read: (value: string) => value as T, write: (value: T) => String(value) };
  const raw = getCookie(name);
  const value = shallowRef(raw == null ? initialValue : serializer.read(raw)) as Ref<T>;
  const set = (next: T) => {
    value.value = next;
    setCookie(name, serializer.write(next), options as CookieOptions<string>);
  };
  const remove = () => {
    removeCookie(name, options.path);
    value.value = initialValue;
  };
  return { value, set, remove };
}
