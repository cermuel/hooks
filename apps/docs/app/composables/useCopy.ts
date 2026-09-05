type UseCopyOptions = {
  resetAfter?: number;
};

export function useCopy(options: UseCopyOptions = {}) {
  const copied = ref(false);
  const error = ref<Error | null>(null);
  const resetAfter = options.resetAfter ?? 1600;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  function clearResetTimer() {
    if (!resetTimer) {
      return;
    }

    clearTimeout(resetTimer);
    resetTimer = undefined;
  }

  function scheduleReset() {
    clearResetTimer();

    resetTimer = setTimeout(() => {
      copied.value = false;
      resetTimer = undefined;
    }, resetAfter);
  }

  async function copy(text: string) {
    error.value = null;

    if (!import.meta.client || !navigator.clipboard) {
      const copyError = new Error("Clipboard is not available.");
      error.value = copyError;
      copied.value = false;
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      scheduleReset();
      return true;
    } catch (cause) {
      const copyError =
        cause instanceof Error ? cause : new Error("Unable to copy text.");
      error.value = copyError;
      copied.value = false;
      clearResetTimer();
      return false;
    }
  }

  onBeforeUnmount(clearResetTimer);

  return {
    copied: readonly(copied),
    error: readonly(error),
    copy,
  };
}
