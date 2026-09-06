export interface CountdownOptions {
  interval?: number;
  onComplete?: () => void;
}

export function resolveCountdownSeconds(seconds: number): number {
  return Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
}

export function getNextCountdownValue(value: number): number {
  return resolveCountdownSeconds(value - 1);
}

export function resolveCountdownInterval(interval = 1000): number {
  return Number.isFinite(interval) ? Math.max(0, interval) : 1000;
}
