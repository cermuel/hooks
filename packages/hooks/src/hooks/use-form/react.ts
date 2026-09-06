import { useState } from "react";

import {
  hasFormErrors,
  isFormDirty,
  validateForm,
  type FormErrors,
  type FormOptions,
} from "./core";

export function useForm<T extends Record<string, any>>(initialValues: T, options: FormOptions<T> = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);
  const setField = <K extends keyof T>(name: K, value: T[K]) => setValues((current) => ({ ...current, [name]: value }));
  const reset = () => { setValues(initialValues); setErrors({}); };
  const submit = async () => {
    setSubmitting(true);
    const nextErrors = await validateForm(values, options.validate);
    setErrors(nextErrors);
    if (!hasFormErrors(nextErrors)) await options.onSubmit?.(values);
    setSubmitting(false);
  };
  return { values, errors, submitting, dirty: isFormDirty(values, initialValues), setValues, setField, reset, submit };
}
