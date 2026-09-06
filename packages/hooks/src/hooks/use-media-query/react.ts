import { useEffect, useState } from "react";
import { isBrowser } from "./core";

export function useMediaQuery(query: string): boolean {
  const get = () => (isBrowser() ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (!isBrowser()) return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
