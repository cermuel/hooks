import { useIdle } from "@cermuel/hooks/react";

export function useIdleExample() {
  const idle = useIdle(60000);

  return <p>{idle.idle ? "Idle" : "Active"}</p>;
}
