import { useReducedMotion } from "@cermuel/hooks/react";

export function useReducedMotionExample() {
  const reduced = useReducedMotion();

  return <p>{reduced ? "Reduced" : "Animated"}</p>;
}
