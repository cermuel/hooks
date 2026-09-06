import { useState } from "react";
import { useUnsavedChanges } from "@cermuel/hooks/react";

export function useUnsavedChangesExample() {
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  return <button type="button" onClick={() => setDirty(true)}>{dirty ? "Unsaved" : "Saved"}</button>;
}
