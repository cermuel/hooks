import { useBreakpoint } from "@cermuel/hooks/react";

export function useBreakpointExample() {
  const breakpoint = useBreakpoint({ sm: 640, md: 768, lg: 1024 });

  return <p>{breakpoint}</p>;
}
