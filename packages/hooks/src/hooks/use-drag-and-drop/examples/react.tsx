import { useDragAndDrop } from "@cermuel/hooks/react";

export function useDragAndDropExample() {
  const drag = useDragAndDrop(['a', 'b']);

  return <p>{drag.items.join(', ')}</p>;
}
