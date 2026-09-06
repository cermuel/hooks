import { useMediaQuery } from "@cermuel/hooks/react";

export function useMediaQueryExample() {
  const wide = useMediaQuery("(min-width: 768px)");

  return <p>{wide ? "Wide" : "Compact"}</p>;
}
