export function defaultSelectionKey<T>(item: T): string {
  return String(item);
}

export function toggleSelectionKey(selected: Set<string>, key: string): Set<string> {
  const next = new Set(selected);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function selectAllKeys<T>(items: T[], getKey: (item: T) => string): Set<string> {
  return new Set(items.map(getKey));
}
