import { useState, useRef } from "react";
import { useClickOutside } from "@cermuel/hooks/react";

export function useClickOutsideExample() {
  const [open, setOpen] = useState(true);
  const target = useRef<HTMLDivElement>(null);
  useClickOutside(target, () => setOpen(false));

  return <div ref={target}>{open ? "Open" : "Closed"}</div>;
}
