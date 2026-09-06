import { useFullscreen } from "@cermuel/hooks/react";

export function useFullscreenExample() {
  const fullscreen = useFullscreen();

  return <button type="button" onClick={fullscreen.toggle}>Toggle fullscreen</button>;
}
