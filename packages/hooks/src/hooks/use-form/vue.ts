import { computed, reactive, ref, type ComputedRef, type Ref } from "vue";

import {
  hasFormErrors,
  isFormDirty,
  validateForm,
  type FormErrors,
  type FormOptions,
} from "./core";

interface VueFormReturn<T extends Record<string, any>> {
  values: T;
  errors: Ref<FormErrors<T>>;
  submitting: Ref<boolean>;
  dirty: ComputedRef<boolean>;
  setField: <K extends keyof T>(name: K, value: T[K]) => void;
  reset: () => void;
  submit: () => Promise<void>;
}

export function useForm<T extends Record<string, any>>(initialValues: T, options: FormOptions<T> = {}): VueFormReturn<T> {
  const values = reactive({ ...initialValues }) as T;
  const errors = ref({}) as Ref<FormErrors<T>>;
  const submitting = ref(false);
  const setField = <K extends keyof T>(name: K, value: T[K]) => { values[name] = value; };
  const reset = () => { Object.assign(values, initialValues); errors.value = {}; };
  const submit = async () => {
    submitting.value = true;
    const nextErrors = await validateForm(values, options.validate);
    errors.value = nextErrors;
    if (!hasFormErrors(nextErrors)) await options.onSubmit?.(values);
    submitting.value = false;
  };
  return { values, errors, submitting, dirty: computed(() => isFormDirty(values, initialValues)), setField, reset, submit };
}
