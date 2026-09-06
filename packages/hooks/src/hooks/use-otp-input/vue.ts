import { computed, ref } from "vue";

import {
  createOtpDigits,
  getOtpValue,
  isOtpComplete,
  pasteOtpValue,
  setOtpDigit,
} from "./core";

export function useOtpInput(length: number) {
  const digits = ref(createOtpDigits(length));
  const setDigit = (index: number, value: string) => { digits.value = setOtpDigit(digits.value, index, value); };
  const paste = (value: string) => { digits.value = pasteOtpValue(value, length); };
  return { digits, value: computed(() => getOtpValue(digits.value)), complete: computed(() => isOtpComplete(digits.value)), setDigit, paste, clear: () => { digits.value = createOtpDigits(length); } };
}
