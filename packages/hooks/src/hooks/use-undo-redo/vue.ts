import { computed, ref, type Ref } from "vue";

import {
  createHistory,
  getNextHistoryIndex,
  getNextIndex,
  getPreviousIndex,
  pushHistory,
} from "./core";

export function useUndoRedo<T>(initialValue: T, limit = 100) {
  const history = ref<T[]>(createHistory(initialValue)) as Ref<T[]>;
  const index = ref(0);
  const value = computed(() => history.value[index.value] as T);
  const set = (next: T) => {
    history.value = pushHistory(history.value, index.value, next, limit);
    index.value = getNextHistoryIndex(index.value, limit);
  };
  return { value, set, history, index, canUndo: computed(() => index.value > 0), canRedo: computed(() => index.value < history.value.length - 1), undo: () => { index.value = getPreviousIndex(index.value); }, redo: () => { index.value = getNextIndex(index.value, history.value.length); }, reset: (next = initialValue) => { history.value = createHistory(next); index.value = 0; } };
}
