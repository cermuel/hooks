import { useState } from "react";
import { useLongPress } from "@cermuel/hooks/react";

export function useLongPressExample() {
  const [pressed, setPressed] = useState(false);
  const press = useLongPress(() => setPressed(true));

  return <button type="button" {...press.bind}>{pressed ? "Pressed" : "Hold"}</button>;
}
