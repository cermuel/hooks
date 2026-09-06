import { useCookie } from "@cermuel/hooks/react";

export function useCookieExample() {
  const cookie = useCookie("theme", "system");

  return <button type="button" onClick={() => cookie.set("dark")}>{cookie.value}</button>;
}
