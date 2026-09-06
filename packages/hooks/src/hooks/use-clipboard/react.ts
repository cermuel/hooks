import { useCallback, useState } from "react";
import { isBrowser } from "./core";

export function useClipboard() {
  const [text, setText] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const supported = isBrowser() && Boolean(navigator.clipboard);
  const copy = useCallback(async (value: string) => {
    if (!supported) {
      const nextError = new Error("Clipboard API is not supported.");
      setError(nextError);
      return false;
    }
    try {
      await navigator.clipboard.writeText(value);
      setText(value);
      setError(null);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason : new Error("Clipboard write failed."));
      return false;
    }
  }, [supported]);
  const read = useCallback(async () => {
    if (!supported) return "";
    const value = await navigator.clipboard.readText();
    setText(value);
    return value;
  }, [supported]);
  return { text, supported, error, copy, read };
}
