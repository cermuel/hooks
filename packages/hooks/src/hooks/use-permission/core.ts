export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export type PermissionStateValue = PermissionState | "unsupported";
