export interface CookieOptions<T> {
  serializer?: Serializer<T>;
  path?: string;
  maxAge?: number;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
}

export function getCookie(name: string): string | undefined {
  if (!isBrowser()) return undefined;
  const pair = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
  return pair ? decodeURIComponent(pair.split("=").slice(1).join("=")) : undefined;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function removeCookie(name: string, path = "/"): void {
  setCookie(name, "", { path, maxAge: 0 });
}

export interface Serializer<T> {
  read(value: string): T;
  write(value: T): string;
}

export function setCookie(name: string, value: string, options: Omit<CookieOptions<string>, "serializer"> = {}): void {
  if (!isBrowser()) return;
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
  parts.push(`path=${options.path ?? "/"}`);
  if (options.maxAge !== undefined) parts.push(`max-age=${options.maxAge}`);
  if (options.sameSite) parts.push(`samesite=${options.sameSite}`);
  if (options.secure) parts.push("secure");
  document.cookie = parts.join("; ");
}
