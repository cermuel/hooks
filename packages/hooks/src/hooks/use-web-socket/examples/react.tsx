import { useWebSocket } from "@cermuel/hooks/react";

export function useWebSocketExample() {
  const socket = useWebSocket("wss://example.com");

  return <p>{socket.status}</p>;
}
