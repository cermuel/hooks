import { useCallback, useEffect, useRef, useState } from "react";
import { type AsyncStatus } from "./core";

export function useAsync<TArgs extends any[], TResult>(fn: (...args: TArgs) => Promise<TResult>, options: { immediate?: boolean; args?: TArgs } = {}) {
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const saved = useStableCallback(fn);
  const execute = useCallback(async (...args: TArgs) => {
    setStatus("loading");
    try {
      const result = await saved(...args);
      setData(result);
      setError(null);
      setStatus("success");
      return result;
    } catch (reason) {
      const nextError = reason instanceof Error ? reason : new Error("Async operation failed.");
      setError(nextError);
      setStatus("error");
      throw nextError;
    }
  }, [saved]);
  useEffect(() => {
    if (options.immediate) void execute(...(options.args ?? [] as unknown as TArgs));
  }, [execute, options.args, options.immediate]);
  return { status, data, error, loading: status === "loading", execute, reset: () => { setStatus("idle"); setData(null); setError(null); } };
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
