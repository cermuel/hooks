import { useCallback, useEffect, useState } from "react";
import { isBrowser, type ThemePreference } from "./core";

export function usePreferredTheme(defaultTheme: ThemePreference = "system") {
  const [theme, setThemeState] = useState<ThemePreference>(() => readPreference() ?? defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(theme));
  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    if (isBrowser()) localStorage.setItem("theme", next);
  }, []);
  useEffect(() => {
    setResolvedTheme(resolveTheme(theme));
    if (!isBrowser()) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setResolvedTheme(resolveTheme(theme));
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);
  return { theme, resolvedTheme, setTheme, isDark: resolvedTheme === "dark" };
}

function readPreference(): ThemePreference {
  if (!isBrowser()) return "system";
  return (localStorage.getItem("theme") as ThemePreference | null) ?? "system";
}

function resolveTheme(theme: ThemePreference): "light" | "dark" {
  if (theme !== "system") return theme;
  return isBrowser() && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
