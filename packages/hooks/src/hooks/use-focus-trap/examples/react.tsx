import { useRef } from "react";
import { useFocusTrap } from "@cermuel/hooks/react";

export function useFocusTrapExample() {
  const target = useRef<HTMLDivElement>(null);
  useFocusTrap(target, true);

  return <div ref={target} tabIndex={-1}>Dialog</div>;
}
