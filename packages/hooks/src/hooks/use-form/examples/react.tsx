import { useForm } from "@cermuel/hooks/react";

export function useFormExample() {
  const form = useForm({ email: '' });

  return <p>{form.dirty ? "Dirty" : "Clean"}</p>;
}
