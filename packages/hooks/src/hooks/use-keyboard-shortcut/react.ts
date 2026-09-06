import { useCallback, useEffect, useRef } from "react";
import { getDefaultTarget, matchesShortcut, resolveTarget, type MaybeTarget } from "./core";

export function useKeyboardShortcut(shortcut: string, handler: (event: KeyboardEvent) => void, options: { enabled?: boolean; preventDefault?: boolean; target?: MaybeTarget } = {}) {
  const saved = useStableCallback(handler);
  useEffect(() => {
    if (options.enabled === false) return;
    const onKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (!matchesShortcut(keyboardEvent, shortcut)) return;
      if (options.preventDefault !== false) keyboardEvent.preventDefault();
      saved(keyboardEvent);
    };
    const target = resolveTarget(options.target) ?? getDefaultTarget();
    target?.addEventListener("keydown", onKeyDown);
    return () => target?.removeEventListener("keydown", onKeyDown);
  }, [options.enabled, options.preventDefault, options.target, saved, shortcut]);
}

function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
}
