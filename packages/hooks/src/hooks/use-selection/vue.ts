import { ref, toValue, type MaybeRefOrGetter, type Ref } from "vue";

import { defaultSelectionKey, selectAllKeys, toggleSelectionKey } from "./core";

export function useSelection<T>(items: MaybeRefOrGetter<T[]>, getKey: (item: T) => string = defaultSelectionKey) {
  const selected = ref(new Set<string>()) as Ref<Set<string>>;
  const toggle = (item: T) => {
    const key = getKey(item);
    selected.value = toggleSelectionKey(selected.value, key);
  };
  const clear = () => { selected.value = new Set(); };
  const selectAll = () => { selected.value = selectAllKeys(toValue(items), getKey); };
  return { selected, toggle, clear, selectAll, isSelected: (item: T) => selected.value.has(getKey(item)) };
}
