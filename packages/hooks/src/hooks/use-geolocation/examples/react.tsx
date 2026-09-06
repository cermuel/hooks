import { useGeolocation } from "@cermuel/hooks/react";

export function useGeolocationExample() {
  const location = useGeolocation();

  return <p>{location.supported ? location.permission : "Unsupported"}</p>;
}
