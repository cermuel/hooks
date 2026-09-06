export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type FormValidator<T> = (
  values: T
) => FormErrors<T> | Promise<FormErrors<T>>;

export interface FormOptions<T> {
  validate?: FormValidator<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function isFormDirty<T>(values: T, initialValues: T): boolean {
  return JSON.stringify(values) !== JSON.stringify(initialValues);
}

export async function validateForm<T>(
  values: T,
  validate?: FormValidator<T>
): Promise<FormErrors<T>> {
  return (await validate?.(values)) ?? {};
}

export function hasFormErrors<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
