import { useState } from "react";
import { usePrevious } from "@cermuel/hooks/react";

export function usePreviousExample() {
  const [count, setCount] = useState(0);
  const previous = usePrevious(count);

  return <button type="button" onClick={() => setCount(count + 1)}>Previous: {previous ?? 0}</button>;
}
