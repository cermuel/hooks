import { useEffect, useState } from "react";
import { isBrowser, type BatterySnapshot } from "./core";

export function useBattery(): BatterySnapshot {
  const [battery, setBattery] = useState<BatterySnapshot>({ supported: false, charging: null, level: null, chargingTime: null, dischargingTime: null });
  useEffect(() => {
    if (!isBrowser() || !("getBattery" in navigator)) return;
    let manager: EventTarget & Partial<BatterySnapshot>;
    const update = () => setBattery({ supported: true, charging: Boolean(manager.charging), level: manager.level ?? null, chargingTime: manager.chargingTime ?? null, dischargingTime: manager.dischargingTime ?? null });
    void (navigator as Navigator & { getBattery: () => Promise<typeof manager> }).getBattery().then((next) => {
      manager = next;
      update();
      ["chargingchange", "levelchange", "chargingtimechange", "dischargingtimechange"].forEach((event) => manager.addEventListener(event, update));
    });
    return () => manager && ["chargingchange", "levelchange", "chargingtimechange", "dischargingtimechange"].forEach((event) => manager.removeEventListener(event, update));
  }, []);
  return battery;
}
