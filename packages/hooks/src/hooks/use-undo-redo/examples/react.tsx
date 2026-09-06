import { useUndoRedo } from "@cermuel/hooks/react";

export function useUndoRedoExample() {
  const history = useUndoRedo('draft');

  return <button type="button" onClick={history.undo}>Undo</button>;
}
