import { ref, shallowRef } from "vue";
import { isBrowser } from "./core";

export function useClipboard() {
  const text = ref("");
  const error = shallowRef<Error | null>(null);
  const supported = isBrowser() && Boolean(navigator.clipboard);
  async function copy(value: string) {
    if (!supported) {
      error.value = new Error("Clipboard API is not supported.");
      return false;
    }
    try {
      await navigator.clipboard.writeText(value);
      text.value = value;
      error.value = null;
      return true;
    } catch (reason) {
      error.value = reason instanceof Error ? reason : new Error("Clipboard write failed.");
      return false;
    }
  }
  async function read() {
    if (!supported) return "";
    text.value = await navigator.clipboard.readText();
    return text.value;
  }
  return { text, supported, error, copy, read };
}
