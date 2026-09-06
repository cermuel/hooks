import { onMounted, onUnmounted, reactive } from "vue";
import { isBrowser, type GeolocationSnapshot } from "./core";

export function useGeolocation(options?: PositionOptions) {
  const state = reactive<GeolocationSnapshot>({ supported: isBrowser() && "geolocation" in navigator, loading: false, permission: "unsupported", position: null, error: null });
  let id: number | undefined;
  onMounted(() => {
    if (!state.supported) return;
    state.loading = true;
    id = navigator.geolocation.watchPosition((position) => {
      Object.assign(state, { supported: true, loading: false, permission: "granted", position, error: null });
    }, (error) => {
      Object.assign(state, { loading: false, permission: "denied", error });
    }, options);
  });
  onUnmounted(() => { if (id !== undefined) navigator.geolocation.clearWatch(id); });
  return state;
}
