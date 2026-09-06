export function createHistory<T>(initialValue: T): T[] {
  return [initialValue];
}

export function pushHistory<T>(
  history: T[],
  index: number,
  value: T,
  limit: number
): T[] {
  return [...history.slice(0, index + 1), value].slice(-Math.max(1, limit));
}

export function getNextHistoryIndex(index: number, limit: number): number {
  return Math.min(index + 1, Math.max(1, limit) - 1);
}

export function getPreviousIndex(index: number): number {
  return Math.max(0, index - 1);
}

export function getNextIndex(index: number, historyLength: number): number {
  return Math.min(Math.max(0, historyLength - 1), index + 1);
}
