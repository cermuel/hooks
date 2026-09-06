import { useDeviceOrientation } from "@cermuel/hooks/react";

export function useDeviceOrientationExample() {
  const orientation = useDeviceOrientation();

  return <p>{orientation.alpha ?? 0}</p>;
}
