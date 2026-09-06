import { useScrollPosition } from "@cermuel/hooks/react";

export function useScrollPositionExample() {
  const position = useScrollPosition();

  return <p>{position.x}, {position.y}</p>;
}
