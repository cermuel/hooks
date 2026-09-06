import { useScrollDirection } from "@cermuel/hooks/react";

export function useScrollDirectionExample() {
  const direction = useScrollDirection();

  return <p>{direction}</p>;
}
