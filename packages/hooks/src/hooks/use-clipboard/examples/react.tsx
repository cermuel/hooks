import { useClipboard } from "@cermuel/hooks/react";

export function useClipboardExample() {
  const { text, copy } = useClipboard();

  return <button type="button" onClick={() => void copy("Hello")}>{text || "Copy"}</button>;
}
