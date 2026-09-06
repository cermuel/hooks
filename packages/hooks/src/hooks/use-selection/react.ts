import { useState } from "react";

import { defaultSelectionKey, selectAllKeys, toggleSelectionKey } from "./core";

export function useSelection<T>(items: T[], getKey: (item: T) => string = defaultSelectionKey) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const toggle = (item: T) => setSelected((value) => {
    const key = getKey(item);
    return toggleSelectionKey(value, key);
  });
  const clear = () => setSelected(new Set());
  const selectAll = () => setSelected(selectAllKeys(items, getKey));
  return { selected, toggle, clear, selectAll, isSelected: (item: T) => selected.has(getKey(item)) };
}
