import { useEffect, useState } from "react";
import { isBrowser, type PermissionStateValue } from "./core";

export function usePermission(name: PermissionName): { supported: boolean; state: PermissionStateValue } {
  const [state, setState] = useState<PermissionStateValue>("unsupported");
  useEffect(() => {
    if (!isBrowser() || !navigator.permissions) return;
    let status: PermissionStatus | undefined;
    void navigator.permissions.query({ name }).then((result) => {
      status = result;
      const update = () => setState(result.state);
      update();
      result.addEventListener("change", update);
    }).catch(() => setState("unsupported"));
    return () => status?.removeEventListener("change", () => setState(status?.state ?? "unsupported"));
  }, [name]);
  return { supported: state !== "unsupported", state };
}
