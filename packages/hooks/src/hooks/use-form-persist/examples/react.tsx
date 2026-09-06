import { useState } from "react";
import { useFormPersist } from "@cermuel/hooks/react";

export function useFormPersistExample() {
  const [draft, setDraft] = useState({ title: '' });
  useFormPersist('contact-form', draft);

  return <input value={draft.title} onChange={(event) => setDraft({ title: event.target.value })} />;
}
