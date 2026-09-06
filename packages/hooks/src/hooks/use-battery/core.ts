export interface BatterySnapshot {
  supported: boolean;
  charging: boolean | null;
  level: number | null;
  chargingTime: number | null;
  dischargingTime: number | null;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
