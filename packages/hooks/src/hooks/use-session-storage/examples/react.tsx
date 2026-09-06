import { useSessionStorage } from "@cermuel/hooks/react";

export function useSessionStorageExample() {
  const [name, setName] = useSessionStorage("name", "Ada");

  return <input value={name} onChange={(event) => setName(event.target.value)} />;
}
