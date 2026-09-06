import { useState } from "react";
import { useThrottle } from "@cermuel/hooks/react";

export function useThrottleExample() {
  const [search, setSearch] = useState("");
  const value = useThrottle(search, 300);

  return <input value={value} onChange={(event) => setSearch(event.target.value)} />;
}
