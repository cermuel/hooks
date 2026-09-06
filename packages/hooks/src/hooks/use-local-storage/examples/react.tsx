import { useLocalStorage } from "@cermuel/hooks/react";

export function useLocalStorageExample() {
  const [name, setName] = useLocalStorage("name", "Ada");

  return <input value={name} onChange={(event) => setName(event.target.value)} />;
}
