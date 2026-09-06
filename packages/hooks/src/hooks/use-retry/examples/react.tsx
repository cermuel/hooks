import { useRetry } from "@cermuel/hooks/react";

export function useRetryExample() {
  async function saveUser() { return true; }
  const retry = useRetry(saveUser);

  return <button type="button" onClick={() => void retry.run()}>Save</button>;
}
