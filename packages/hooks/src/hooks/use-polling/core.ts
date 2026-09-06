export type AsyncStatus = "idle" | "loading" | "success" | "error";

export function getDefaultTarget(): Window | undefined {
  return isBrowser() ? window : undefined;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export type MaybeElement = EventTarget | null | undefined;

export type MaybeTarget<T extends MaybeElement = MaybeElement> =
  | T
  | { current?: T | null }
  | { value?: T | null }
  | (() => T);

export interface PollingOptions {
  interval?: number;
  immediate?: boolean;
  pauseWhenHidden?: boolean;
  pauseWhenOffline?: boolean;
}

export function resolveTarget<T extends MaybeElement>(target?: MaybeTarget<T>): T | undefined {
  if (!target) return undefined;
  if (typeof target === "function") return target() ?? undefined;
  if ("current" in Object(target)) return (target as { current?: T | null }).current ?? undefined;
  if ("value" in Object(target)) return (target as { value?: T | null }).value ?? undefined;
  return target as T;
}
