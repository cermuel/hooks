export function getDefaultTarget(): Window | undefined {
  return isBrowser() ? window : undefined;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const parts = parseShortcut(shortcut);
  const key = event.key.toLowerCase();
  const mod = event.metaKey || event.ctrlKey;
  if (parts.has("mod") && !mod) return false;
  if (parts.has("ctrl") && !event.ctrlKey) return false;
  if (parts.has("meta") && !event.metaKey) return false;
  if (parts.has("shift") && !event.shiftKey) return false;
  if (parts.has("alt") && !event.altKey) return false;
  const keyParts = [...parts].filter((part) => !["mod", "ctrl", "meta", "shift", "alt"].includes(part));
  return keyParts.length === 0 || keyParts.includes(key);
}

export type MaybeElement = EventTarget | null | undefined;

export type MaybeTarget<T extends MaybeElement = MaybeElement> =
  | T
  | { current?: T | null }
  | { value?: T | null }
  | (() => T);

export function parseShortcut(shortcut: string): Set<string> {
  return new Set(shortcut.toLowerCase().split("+").map((part) => part.trim()).filter(Boolean));
}

export function resolveTarget<T extends MaybeElement>(target?: MaybeTarget<T>): T | undefined {
  if (!target) return undefined;
  if (typeof target === "function") return target() ?? undefined;
  if ("current" in Object(target)) return (target as { current?: T | null }).current ?? undefined;
  if ("value" in Object(target)) return (target as { value?: T | null }).value ?? undefined;
  return target as T;
}
