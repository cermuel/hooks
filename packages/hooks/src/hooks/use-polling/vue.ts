import { computed, onMounted, onUnmounted, ref, shallowRef, toValue, watch, type ComputedRef, type MaybeRefOrGetter, type Ref } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type AsyncStatus, type MaybeTarget, type PollingOptions } from "./core";

interface VueAsyncReturn<TArgs extends any[], TResult> {
  status: Ref<AsyncStatus>;
  data: Ref<TResult | null>;
  error: Ref<Error | null>;
  loading: ComputedRef<boolean>;
  execute: (...args: TArgs) => Promise<TResult>;
  reset: () => void;
}
interface VuePollingReturn<TResult> extends VueAsyncReturn<[], TResult> {
  running: Ref<boolean>;
  start: () => void;
  stop: () => void;
}

export function usePolling<TResult>(fn: () => Promise<TResult>, options: PollingOptions = {}): VuePollingReturn<TResult> {
  const request = useAsync(fn);
  const running = ref(options.immediate ?? true);
  const visible = useDocumentVisibility();
  let id: ReturnType<typeof setInterval> | undefined;
  watch([running, visible], ([active, isVisible]) => {
    clearInterval(id);
    if (!active || (options.pauseWhenHidden && !isVisible)) return;
    void request.execute();
    id = setInterval(() => void request.execute(), options.interval ?? 5000);
  }, { immediate: true });
  onUnmounted(() => clearInterval(id));
  return { ...request, running, start: () => { running.value = true; }, stop: () => { running.value = false; } };
}

function useDocumentVisibility(): Ref<boolean> {
  const visible = ref(isBrowser() ? document.visibilityState === "visible" : true);
  useEventListener("visibilitychange", () => { visible.value = document.visibilityState === "visible"; }, isBrowser() ? document : undefined);
  return visible;
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

function useAsync<TArgs extends any[], TResult>(fn: (...args: TArgs) => Promise<TResult>, options: { immediate?: boolean; args?: TArgs } = {}): VueAsyncReturn<TArgs, TResult> {
  const status = ref<AsyncStatus>("idle");
  const data = shallowRef<TResult | null>(null);
  const error = shallowRef<Error | null>(null);
  const execute = async (...args: TArgs) => {
    status.value = "loading";
    try {
      const result = await fn(...args);
      data.value = result;
      error.value = null;
      status.value = "success";
      return result;
    } catch (reason) {
      const nextError = reason instanceof Error ? reason : new Error("Async operation failed.");
      error.value = nextError;
      status.value = "error";
      throw nextError;
    }
  };
  onMounted(() => { if (options.immediate) void execute(...(options.args ?? [] as unknown as TArgs)); });
  return { status, data, error, loading: computed(() => status.value === "loading"), execute, reset: () => { status.value = "idle"; data.value = null; error.value = null; } };
}
