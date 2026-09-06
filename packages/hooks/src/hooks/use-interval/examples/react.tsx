import { useState } from "react";
import { useInterval } from "@cermuel/hooks/react";

export function useIntervalExample() {
  const [ticks, setTicks] = useState(0);
  const { start, stop, running } = useInterval(() => setTicks((value) => value + 1), 1000);

  return <button type="button" onClick={running ? stop : start}>{running ? "Stop" : `Start ${ticks}`}</button>;
}
