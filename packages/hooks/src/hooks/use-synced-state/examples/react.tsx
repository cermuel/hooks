import { useSyncedState } from "@cermuel/hooks/react";

export function useSyncedStateExample() {
  const [value, setValue] = useSyncedState("shared", "");

  return <input value={value} onChange={(event) => setValue(event.target.value)} />;
}
