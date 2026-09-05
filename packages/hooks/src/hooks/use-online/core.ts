function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getOnlineStatus(): boolean {
  return isBrowser() ? navigator.onLine : true;
}

export function subscribeToOnlineStatus(callback: (online: boolean) => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const emit = () => callback(navigator.onLine);

  window.addEventListener("online", emit);
  window.addEventListener("offline", emit);

  return () => {
    window.removeEventListener("online", emit);
    window.removeEventListener("offline", emit);
  };
}
