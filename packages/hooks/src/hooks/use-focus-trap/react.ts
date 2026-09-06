import { useEffect } from "react";
import { isBrowser, resolveTarget, type MaybeTarget } from "./core";

export function useFocusTrap<T extends HTMLElement>(target: MaybeTarget<T>, active = true) {
  useEffect(() => {
    if (!active || !isBrowser()) return;
    const element = resolveTarget(target);
    if (!element) return;
    const focusable = () => Array.from(element.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex='-1'])"));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    element.addEventListener("keydown", onKeyDown);
    return () => element.removeEventListener("keydown", onKeyDown);
  }, [active, target]);
}
