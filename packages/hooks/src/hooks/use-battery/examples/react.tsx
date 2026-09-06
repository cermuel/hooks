import { useBattery } from "@cermuel/hooks/react";

export function useBatteryExample() {
  const battery = useBattery();

  return <p>{battery.level == null ? "Unknown" : battery.level}</p>;
}
