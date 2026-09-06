import { usePageFocus } from "@cermuel/hooks/react";

export function usePageFocusExample() {
  const focused = usePageFocus();

  return <p>{focused ? "Focused" : "Blurred"}</p>;
}
