export const defaultDebounceDelay = 250;

export function resolveDebounceDelay(delay: number): number {
  return Number.isFinite(delay) ? Math.max(0, delay) : defaultDebounceDelay;
}

export function createDebounceTimer(
  callback: () => void,
  delay: number
): () => void {
  const timeout = globalThis.setTimeout(callback, resolveDebounceDelay(delay));

  return () => {
    globalThis.clearTimeout(timeout);
  };
}
