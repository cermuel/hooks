import { useEffect, useState } from "react";
import { isBrowser, type GeolocationSnapshot } from "./core";

export function useGeolocation(options?: PositionOptions): GeolocationSnapshot {
  const [state, setState] = useState<GeolocationSnapshot>({ supported: isBrowser() && "geolocation" in navigator, loading: false, permission: "unsupported", position: null, error: null });
  useEffect(() => {
    if (!state.supported) return;
    setState((value) => ({ ...value, loading: true }));
    const id = navigator.geolocation.watchPosition(
      (position) => setState({ supported: true, loading: false, permission: "granted", position, error: null }),
      (error) => setState((value) => ({ ...value, loading: false, permission: "denied", error })),
      options
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [options, state.supported]);
  return state;
}
