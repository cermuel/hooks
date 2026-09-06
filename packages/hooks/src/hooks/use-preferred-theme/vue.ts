import { computed, onMounted, onUnmounted, ref, toValue, type MaybeRefOrGetter } from "vue";
import { getDefaultTarget, isBrowser, resolveTarget, type MaybeTarget, type ThemePreference } from "./core";

export function usePreferredTheme(defaultTheme: ThemePreference = "system") {
  const theme = ref<ThemePreference>(readPreference() ?? defaultTheme);
  const resolvedTheme = ref(resolveTheme(theme.value));
  const setTheme = (next: ThemePreference) => {
    theme.value = next;
    if (isBrowser()) localStorage.setItem("theme", next);
    resolvedTheme.value = resolveTheme(next);
  };
  useEventListener("change", () => { resolvedTheme.value = resolveTheme(theme.value); }, () => isBrowser() ? window.matchMedia("(prefers-color-scheme: dark)") : undefined);
  return { theme, resolvedTheme, setTheme, isDark: computed(() => resolvedTheme.value === "dark") };
}

function useEventListener(type: string, listener: EventListener, target?: MaybeTarget, options?: AddEventListenerOptions): void {
  const saved = useStableCallback(listener);
  let cleanup: (() => void) | undefined;
  onMounted(() => {
    const element = resolveTarget(target) ?? getDefaultTarget();
    if (!element) return;
    element.addEventListener(type, saved, options);
    cleanup = () => element.removeEventListener(type, saved, options);
  });
  onUnmounted(() => cleanup?.());
}

function useStableCallback<T extends (...args: any[]) => any>(callback: MaybeRefOrGetter<T>): T {
  return ((...args: Parameters<T>) => toValue(callback)(...args)) as T;
}

function readPreference(): ThemePreference {
  if (!isBrowser()) return "system";
  return (localStorage.getItem("theme") as ThemePreference | null) ?? "system";
}

function resolveTheme(theme: ThemePreference): "light" | "dark" {
  if (theme !== "system") return theme;
  return isBrowser() && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
