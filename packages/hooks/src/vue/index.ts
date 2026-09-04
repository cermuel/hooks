import { onMounted, onUnmounted, ref, type Ref } from "vue";

import { getOnlineStatus, subscribeToOnlineStatus } from "../core/online";

export function useOnline(): Ref<boolean> {
  const online = ref(getOnlineStatus());
  let unsubscribe: (() => void) | undefined;

  onMounted(() => {
    unsubscribe = subscribeToOnlineStatus((value) => {
      online.value = value;
    });
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  return online;
}
