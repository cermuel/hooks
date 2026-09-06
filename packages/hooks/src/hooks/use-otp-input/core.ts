export function createOtpDigits(length: number): string[] {
  return Array.from({ length: Math.max(0, length) }, () => "");
}

export function setOtpDigit(digits: string[], index: number, value: string): string[] {
  return digits.map((digit, digitIndex) =>
    digitIndex === index ? value.slice(-1) : digit
  );
}

export function pasteOtpValue(value: string, length: number): string[] {
  return value
    .slice(0, Math.max(0, length))
    .split("")
    .concat(createOtpDigits(length))
    .slice(0, Math.max(0, length));
}

export function getOtpValue(digits: string[]): string {
  return digits.join("");
}

export function isOtpComplete(digits: string[]): boolean {
  return digits.length > 0 && digits.every(Boolean);
}
