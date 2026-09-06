import { useCallback, useEffect, useRef, useState } from "react";
import { isBrowser, type WebSocketOptions, type WebSocketStatus } from "./core";

export function useWebSocket(url: string, options: WebSocketOptions = {}) {
  const [status, setStatus] = useState<WebSocketStatus>("idle");
  const [messages, setMessages] = useState<MessageEvent[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const connect = useCallback(() => {
    if (!isBrowser() || !("WebSocket" in window)) {
      setStatus("unsupported");
      return;
    }
    setStatus("connecting");
    const socket = new WebSocket(url, options.protocols);
    socketRef.current = socket;
    socket.onopen = () => setStatus("open");
    socket.onerror = () => setStatus("error");
    socket.onmessage = (message) => setMessages((items) => [...items, message]);
    socket.onclose = () => {
      setStatus("closed");
      if (options.reconnect) setTimeout(connect, options.reconnectDelay ?? 1000);
    };
  }, [options.protocols, options.reconnect, options.reconnectDelay, url]);
  useEffect(() => {
    connect();
    return () => socketRef.current?.close();
  }, [connect]);
  return { status, messages, send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => socketRef.current?.send(data), close: () => socketRef.current?.close(), connect };
}
