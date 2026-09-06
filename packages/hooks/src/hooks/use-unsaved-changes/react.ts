import { useEffect } from "react";
import { isBrowser } from "./core";

export function useUnsavedChanges(enabled: boolean, message = "You have unsaved changes.") {
  useEffect(() => {
    if (!enabled || !isBrowser()) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled, message]);
}
