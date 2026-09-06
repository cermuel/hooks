import { usePermission } from "@cermuel/hooks/react";

export function usePermissionExample() {
  const camera = usePermission("camera" as PermissionName);

  return <p>{camera.state}</p>;
}
