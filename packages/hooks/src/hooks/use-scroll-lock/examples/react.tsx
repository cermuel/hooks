import { useScrollLock } from "@cermuel/hooks/react";

export function useScrollLockExample() {
  const { locked, lock, unlock } = useScrollLock();

  return <button type="button" onClick={locked ? unlock : lock}>{locked ? "Unlock" : "Lock"}</button>;
}
