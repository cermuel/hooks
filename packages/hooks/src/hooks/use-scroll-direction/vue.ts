import { onMounted, onUnmounted, reactive, ref, toValue, watch, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useScrollDirection(target?: MaybeTarget<Element | Window>) {
  const direction = ref<"up" | "down" | "left" | "right" | "none">("none");
  const position = useScrollPosition(target);
  let previous = { x: position.x, y: position.y };
  watch(position, () => {
    const dx = position.x - previous.x;
    const dy = position.y - previous.y;
    direction.value = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy === 0 ? "none" : dy > 0 ? "down" : "up";
    previous = { x: position.x, y: position.y };
  });
  return direction;
}

function useScrollPosition(target?: MaybeTarget<Element | Window>) {
  const position = reactive({ x: 0, y: 0 });
  const read = () => {
    const element = resolveTarget(target);
    if (!isBrowser()) return;
    if (!element || element === window) Object.assign(position, { x: window.scrollX, y: window.scrollY });
    else Object.assign(position, { x: (element as Element).scrollLeft, y: (element as Element).scrollTop });
  };
  useEventListener("scroll", read, target);
  onMounted(read);
  return position;
}

function useEventListener(type: string, listener: EventListener, target?: MaybeTarget, options?: AddEventListenerOptions): void {
  const saved = useStableCallback(listener);
  let cleanup: (() => void) | undefined;
  onMounted(() => {
    const element = resolveTarget(target) ?? getDefaultTarget();
    if (!element) return;
    element.addEventListener(type, saved, options);
    cleanup = () => element.removeEventListener(type, saved, options);
  });
  onUnmounted(() => cleanup?.());
}

function useStableCallback<T extends (...args: any[]) => any>(callback: MaybeRefOrGetter<T>): T {
  return ((...args: Parameters<T>) => toValue(callback)(...args)) as T;
}
