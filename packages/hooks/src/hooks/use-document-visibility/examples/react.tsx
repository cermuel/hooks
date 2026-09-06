import { useDocumentVisibility } from "@cermuel/hooks/react";

export function useDocumentVisibilityExample() {
  const visible = useDocumentVisibility();

  return <p>{visible ? "Visible" : "Hidden"}</p>;
}
