export const defaultThrottleDelay = 250;

export function resolveThrottleDelay(delay: number): number {
  return Number.isFinite(delay) ? Math.max(0, delay) : defaultThrottleDelay;
}

export function getThrottleWait(lastRun: number, delay: number, now = Date.now()): number {
  return Math.max(0, resolveThrottleDelay(delay) - (now - lastRun));
}
