import { onUnmounted, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from "vue";
import { type AutosaveStatus } from "./core";

export function useAutosave<T>(value: MaybeRefOrGetter<T>, save: (value: T) => Promise<void> | void, delay = 500) {
  const status = ref<AutosaveStatus>("idle");
  const error = shallowRef<Error | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const stop = watch(() => toValue(value), (next) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      status.value = "saving";
      Promise.resolve(save(next)).then(() => { status.value = "saved"; error.value = null; }).catch((reason) => { status.value = "error"; error.value = reason instanceof Error ? reason : new Error("Autosave failed."); });
    }, delay);
  }, { deep: true });
  onUnmounted(() => { clearTimeout(timer); stop(); });
  return { status, error };
}
