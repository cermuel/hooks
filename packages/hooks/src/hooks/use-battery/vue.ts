import { onMounted, onUnmounted, reactive } from "vue";
import { isBrowser, type BatterySnapshot } from "./core";

export function useBattery() {
  const battery = reactive<BatterySnapshot>({ supported: false, charging: null, level: null, chargingTime: null, dischargingTime: null });
  let manager: (EventTarget & Partial<BatterySnapshot>) | undefined;
  const update = () => manager && Object.assign(battery, { supported: true, charging: Boolean(manager.charging), level: manager.level ?? null, chargingTime: manager.chargingTime ?? null, dischargingTime: manager.dischargingTime ?? null });
  onMounted(() => {
    if (!isBrowser() || !("getBattery" in navigator)) return;
    void (navigator as Navigator & { getBattery: () => Promise<typeof manager> }).getBattery().then((next) => {
      manager = next;
      update();
      ["chargingchange", "levelchange", "chargingtimechange", "dischargingtimechange"].forEach((event) => manager?.addEventListener(event, update));
    });
  });
  onUnmounted(() => ["chargingchange", "levelchange", "chargingtimechange", "dischargingtimechange"].forEach((event) => manager?.removeEventListener(event, update)));
  return battery;
}
