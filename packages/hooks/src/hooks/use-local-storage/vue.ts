import { onMounted, onUnmounted, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";
import { getDefaultTarget, getStorage, readStorageValue, resolveTarget, writeStorageValue, type MaybeTarget, type StorageOptions } from "./core";

export function useLocalStorage<T>(key: string, initialValue: T, options?: StorageOptions<T>) {
  return useStorageState("local", key, initialValue, options);
}

function useStorageState<T>(kind: "local" | "session", key: string, initialValue: T, options: StorageOptions<T> = {}) {
  const value = shallowRef(readStorageValue(getStorage(kind), key, initialValue, options.serializer)) as Ref<T>;
  watch(value, (next) => writeStorageValue(getStorage(kind), key, next, options.serializer), { deep: true });
  useEventListener("storage", (event) => {
    if ((event as StorageEvent).key === key) value.value = readStorageValue(getStorage(kind), key, initialValue, options.serializer);
  });
  return value;
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
