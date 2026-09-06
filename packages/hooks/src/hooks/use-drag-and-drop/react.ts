import { useCallback, useState } from "react";
import { moveItem } from "./core";

export function useDragAndDrop<T>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const move = useCallback((from: number, to: number) => setItems((value) => moveItem(value, from, to)), []);
  return { items, setItems, draggingIndex, setDraggingIndex, move, getDraggableProps: (index: number) => ({ draggable: true, onDragStart: () => setDraggingIndex(index) }), getDropProps: (index: number) => ({ onDragOver: (event: React.DragEvent) => event.preventDefault(), onDrop: () => { if (draggingIndex != null) move(draggingIndex, index); setDraggingIndex(null); } }) };
}
