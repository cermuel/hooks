import { useSelection } from "@cermuel/hooks/react";

export function useSelectionExample() {
  const selection = useSelection(['a', 'b', 'c']);

  return <p>{selection.selected.size} selected</p>;
}
