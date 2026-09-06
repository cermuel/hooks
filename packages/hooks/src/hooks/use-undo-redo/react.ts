import { useCallback, useState } from "react";

import {
  createHistory,
  getNextHistoryIndex,
  getNextIndex,
  getPreviousIndex,
  pushHistory,
} from "./core";

export function useUndoRedo<T>(initialValue: T, limit = 100) {
  const [history, setHistory] = useState<T[]>(() => createHistory(initialValue));
  const [index, setIndex] = useState(0);
  const value = history[index] as T;
  const set = useCallback((next: T) => {
    setHistory((items) => pushHistory(items, index, next, limit));
    setIndex((current) => getNextHistoryIndex(current, limit));
  }, [index, limit]);
  return { value, set, history, index, canUndo: index > 0, canRedo: index < history.length - 1, undo: () => setIndex(getPreviousIndex), redo: () => setIndex((value) => getNextIndex(value, history.length)), reset: (next = initialValue) => { setHistory(createHistory(next)); setIndex(0); } };
}
