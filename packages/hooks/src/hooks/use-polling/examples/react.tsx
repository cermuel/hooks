import { usePolling } from "@cermuel/hooks/react";

export function usePollingExample() {
  async function fetchUser() { return { name: 'Ada' }; }
  const polling = usePolling(fetchUser, { interval: 5000 });

  return <p>{polling.running ? "Polling" : "Paused"}</p>;
}
