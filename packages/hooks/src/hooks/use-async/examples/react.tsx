import { useAsync } from "@cermuel/hooks/react";

export function useAsyncExample() {
  async function fetchUser() { return { name: 'Ada' }; }
  const request = useAsync(fetchUser);

  return <button type="button" onClick={() => void request.execute()}>Load</button>;
}
