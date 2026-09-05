type ThemeMode = "dark" | "light";

export function useTheme() {
  const colorMode = useColorMode();

  const theme = computed<ThemeMode>(() =>
    colorMode.value === "light" ? "light" : "dark"
  );

  const nextTheme = computed<ThemeMode>(() =>
    theme.value === "dark" ? "light" : "dark"
  );

  function setTheme(mode: ThemeMode) {
    colorMode.preference = mode;
  }

  function toggleTheme() {
    setTheme(nextTheme.value);
  }

  return {
    theme,
    nextTheme,
    setTheme,
    toggleTheme,
  };
}
