import { useElementSize } from "@cermuel/hooks/react";

export function useElementSizeExample() {
  const { ref, width, height } = useElementSize<HTMLDivElement>();

  return <div ref={ref}>{width} x {height}</div>;
}
