import { usePreferredTheme } from "@cermuel/hooks/react";

export function usePreferredThemeExample() {
  const theme = usePreferredTheme();

  return <p>{theme.theme}</p>;
}
