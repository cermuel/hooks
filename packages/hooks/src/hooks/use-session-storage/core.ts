export function getDefaultTarget(): Window | undefined {
  return isBrowser() ? window : undefined;
}

export function getStorage(kind: "local" | "session"): Storage | undefined {
  if (!isBrowser()) return undefined;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function jsonSerializer<T>(): Serializer<T> {
  return {
    read: (value) => JSON.parse(value) as T,
    write: (value) => JSON.stringify(value),
  };
}

export type MaybeElement = EventTarget | null | undefined;

export type MaybeTarget<T extends MaybeElement = MaybeElement> =
  | T
  | { current?: T | null }
  | { value?: T | null }
  | (() => T);

export function readStorageValue<T>(
  storage: Storage | undefined,
  key: string,
  initialValue: T,
  serializer: Serializer<T> = jsonSerializer<T>()
): T {
  if (!storage) return initialValue;
  const raw = storage.getItem(key);
  if (raw == null) return initialValue;
  try {
    return serializer.read(raw);
  } catch {
    return initialValue;
  }
}

export function resolveTarget<T extends MaybeElement>(target?: MaybeTarget<T>): T | undefined {
  if (!target) return undefined;
  if (typeof target === "function") return target() ?? undefined;
  if ("current" in Object(target)) return (target as { current?: T | null }).current ?? undefined;
  if ("value" in Object(target)) return (target as { value?: T | null }).value ?? undefined;
  return target as T;
}

export interface Serializer<T> {
  read(value: string): T;
  write(value: T): string;
}

export interface StorageOptions<T> {
  serializer?: Serializer<T>;
  sync?: boolean;
}

export function writeStorageValue<T>(
  storage: Storage | undefined,
  key: string,
  value: T,
  serializer: Serializer<T> = jsonSerializer<T>()
): void {
  storage?.setItem(key, serializer.write(value));
}
