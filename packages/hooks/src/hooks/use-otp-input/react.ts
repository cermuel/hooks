import { useState } from "react";

import {
  createOtpDigits,
  getOtpValue,
  isOtpComplete,
  pasteOtpValue,
  setOtpDigit,
} from "./core";

export function useOtpInput(length: number) {
  const [digits, setDigits] = useState(() => createOtpDigits(length));
  const setDigit = (index: number, value: string) =>
    setDigits((items) => setOtpDigit(items, index, value));
  const paste = (value: string) => setDigits(pasteOtpValue(value, length));
  return { digits, value: getOtpValue(digits), complete: isOtpComplete(digits), setDigit, paste, clear: () => setDigits(createOtpDigits(length)) };
}
