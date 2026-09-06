import { onMounted, onUnmounted, ref } from "vue";
import { isBrowser, type WebSocketOptions, type WebSocketStatus } from "./core";

export function useWebSocket(url: string, options: WebSocketOptions = {}) {
  const status = ref<WebSocketStatus>("idle");
  const messages = ref<MessageEvent[]>([]);
  let socket: WebSocket | undefined;
  const connect = () => {
    if (!isBrowser() || !("WebSocket" in window)) {
      status.value = "unsupported";
      return;
    }
    status.value = "connecting";
    socket = new WebSocket(url, options.protocols);
    socket.onopen = () => { status.value = "open"; };
    socket.onerror = () => { status.value = "error"; };
    socket.onmessage = (message) => { messages.value = [...messages.value, message]; };
    socket.onclose = () => {
      status.value = "closed";
      if (options.reconnect) setTimeout(connect, options.reconnectDelay ?? 1000);
    };
  };
  onMounted(connect);
  onUnmounted(() => socket?.close());
  return { status, messages, send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => socket?.send(data), close: () => socket?.close(), connect };
}
