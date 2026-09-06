import { useState } from "react";
import { useKeyboardShortcut } from "@cermuel/hooks/react";

export function useKeyboardShortcutExample() {
  const [open, setOpen] = useState(false);
  useKeyboardShortcut("mod+k", () => setOpen(true));

  return <p>{open ? "Open" : "Closed"}</p>;
}
