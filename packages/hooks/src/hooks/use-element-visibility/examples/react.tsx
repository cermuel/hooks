import { useElementVisibility } from "@cermuel/hooks/react";

export function useElementVisibilityExample() {
  const { ref, visible } = useElementVisibility<HTMLDivElement>();

  return <div ref={ref}>{visible ? "Visible" : "Hidden"}</div>;
}
