import { ref, type Ref } from "vue";
import { moveItem } from "./core";

export function useDragAndDrop<T>(initialItems: T[]) {
  const items = ref(initialItems) as Ref<T[]>;
  const draggingIndex = ref<number | null>(null);
  const move = (from: number, to: number) => { items.value = moveItem(items.value, from, to); };
  return { items, draggingIndex, move, setItems: (next: T[]) => { items.value = next; } };
}
