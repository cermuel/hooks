import { useState } from "react";
import { useEventListener } from "@cermuel/hooks/react";

export function useEventListenerExample() {
  const [count, setCount] = useState(0);
  useEventListener("resize", () => setCount((value) => value + 1));

  return <p>Resizes: {count}</p>;
}
