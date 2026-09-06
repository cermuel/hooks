import { computed, onMounted, ref, shallowRef, type ComputedRef, type Ref } from "vue";
import { type AsyncStatus } from "./core";

interface VueAsyncReturn<TArgs extends any[], TResult> {
  status: Ref<AsyncStatus>;
  data: Ref<TResult | null>;
  error: Ref<Error | null>;
  loading: ComputedRef<boolean>;
  execute: (...args: TArgs) => Promise<TResult>;
  reset: () => void;
}

export function useAsync<TArgs extends any[], TResult>(fn: (...args: TArgs) => Promise<TResult>, options: { immediate?: boolean; args?: TArgs } = {}): VueAsyncReturn<TArgs, TResult> {
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
