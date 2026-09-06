import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultTarget, isBrowser, resolveTarget, type AsyncStatus, type MaybeTarget, type PollingOptions } from "./core";

export function usePolling<TResult>(fn: () => Promise<TResult>, options: PollingOptions = {}) {
  const request = useAsync(fn);
  const [running, setRunning] = useState(options.immediate ?? true);
  const visible = useDocumentVisibility();
  useEffect(() => {
    if (!running) return;
    if (options.pauseWhenHidden && !visible) return;
    const id = setInterval(() => void request.execute(), options.interval ?? 5000);
    void request.execute();
    return () => clearInterval(id);
  }, [options.interval, options.pauseWhenHidden, request.execute, running, visible]);
  return { ...request, running, start: () => setRunning(true), stop: () => setRunning(false) };
}

function useDocumentVisibility(): boolean {
  const get = () => (isBrowser() ? document.visibilityState === "visible" : true);
  const [visible, setVisible] = useState(get);
  useEventListener("visibilitychange", () => setVisible(get()), isBrowser() ? document : undefined);
  return visible;
}

function useEventListener(type: string, listener: EventListener, target?: MaybeTarget, options?: AddEventListenerOptions): void {
  const saved = useStableCallback(listener);
  useEffect(() => {
    const element = resolveTarget(target) ?? getDefaultTarget();
    if (!element) return;
    element.addEventListener(type, saved, options);
    return () => element.removeEventListener(type, saved, options);
  }, [options, saved, target, type]);
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}

function useAsync<TArgs extends any[], TResult>(fn: (...args: TArgs) => Promise<TResult>, options: { immediate?: boolean; args?: TArgs } = {}) {
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
