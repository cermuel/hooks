export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export interface WebSocketOptions {
  protocols?: string | string[];
  reconnect?: boolean;
  reconnectDelay?: number;
}

export type WebSocketStatus = "idle" | "connecting" | "open" | "closed" | "error" | "unsupported";
