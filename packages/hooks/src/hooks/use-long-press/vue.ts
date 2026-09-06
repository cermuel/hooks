import { onUnmounted } from "vue";
import { type LongPressOptions } from "./core";

export function useLongPress(handler: () => void, options: LongPressOptions = {}) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const start = () => { clearTimeout(timer); timer = setTimeout(handler, options.delay ?? 500); };
  const cancel = () => clearTimeout(timer);
  onUnmounted(cancel);
  return { bind: { onPointerdown: start, onPointerup: cancel, onPointerleave: cancel, onPointercancel: cancel }, start, cancel };
}
