import { useState } from "react";
import { useAutosave } from "@cermuel/hooks/react";

export function useAutosaveExample() {
  const [draft, setDraft] = useState({ title: "" });
  const autosave = useAutosave(draft, async () => undefined);

  return (
    <label>
      <input
        value={draft.title}
        onChange={(event) => setDraft({ title: event.target.value })}
      />
      {autosave.status}
    </label>
  );
}
