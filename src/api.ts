function resolveApiBase(): string {
  const configuredApiBase = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
  if (configuredApiBase) {
    return configuredApiBase;
  }

  if (typeof window === "undefined") {
    return "";
  }

  const { hostname, port, protocol } = window.location;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  if (isLocalHost && port && port !== "3000") {
    return `${protocol}//${hostname}:3000`;
  }

  return "";
}

const apiBase = resolveApiBase();

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
}

export async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await response.json();
      return body?.error || body?.message || fallback;
    }
    const text = await response.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}
