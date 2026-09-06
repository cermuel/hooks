export interface IntervalOptions {
  immediate?: boolean;
  autoStart?: boolean;
}

export function resolveIntervalDelay(delay: number): number {
  return Number.isFinite(delay) ? Math.max(0, delay) : 0;
}
