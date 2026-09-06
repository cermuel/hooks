import { computed, onMounted, onUnmounted, ref } from "vue";
import { isBrowser, type PermissionStateValue } from "./core";

export function usePermission(name: PermissionName) {
  const state = ref<PermissionStateValue>("unsupported");
  let status: PermissionStatus | undefined;
  const update = () => { state.value = status?.state ?? "unsupported"; };
  onMounted(() => {
    if (!isBrowser() || !navigator.permissions) return;
    void navigator.permissions.query({ name }).then((result) => {
      status = result;
      update();
      result.addEventListener("change", update);
    }).catch(() => { state.value = "unsupported"; });
  });
  onUnmounted(() => status?.removeEventListener("change", update));
  return { supported: computed(() => state.value !== "unsupported"), state };
}
