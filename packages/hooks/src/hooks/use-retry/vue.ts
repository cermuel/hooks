import { ref } from "vue";
import { type RetryOptions } from "./core";

export function useRetry<TArgs extends any[], TResult>(fn: (...args: TArgs) => Promise<TResult>, options: RetryOptions = {}) {
  const attempt = ref(0);
  const run = async (...args: TArgs) => {
    const retries = options.retries ?? 3;
    const delay = options.delay ?? 250;
    const factor = options.factor ?? 2;
    let lastError: unknown;
    for (let index = 0; index <= retries; index += 1) {
      attempt.value = index + 1;
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        if (index < retries) await new Promise((resolve) => setTimeout(resolve, delay * factor ** index));
      }
    }
    throw lastError;
  };
  return { attempt, run };
}
