import { useWindowSize } from "@cermuel/hooks/react";

export function useWindowSizeExample() {
  const size = useWindowSize();

  return <p>{size.width} x {size.height}</p>;
}
