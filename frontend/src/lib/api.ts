export function getApiUrl(path: string): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal) {
      return `http://localhost:8000${path.startsWith("/") ? path : `/${path}`}`;
    }
    return path.startsWith("/") ? path : `/${path}`;
  }

  return `http://localhost:8000${path.startsWith("/") ? path : `/${path}`}`;
}
