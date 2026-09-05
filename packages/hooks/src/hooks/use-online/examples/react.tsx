import { useOnline } from "@cermuel/hooks/react";

export function UseOnlineExample() {
  const online = useOnline();

  return <p>You are currently {online ? "online" : "offline"}.</p>;
}
