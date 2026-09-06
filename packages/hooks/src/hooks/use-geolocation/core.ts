export interface GeolocationSnapshot {
  supported: boolean;
  loading: boolean;
  permission: PermissionStateValue;
  position: GeolocationPosition | null;
  error: GeolocationPositionError | Error | null;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export type PermissionStateValue = PermissionState | "unsupported";
