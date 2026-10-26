import { API_URL } from "@/app/utils/constants";

export interface BackendMedia {
  url?: string;
  filename?: string;
}

export function resolveBackendMediaUrl(media?: BackendMedia | null): string {
  if (!media) return "";

  const url = media.url || "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/")) return `/api/backend${url}`;
  if (url.startsWith("/media/") || url.startsWith("/menu-images/")) {
    return `${API_URL}${url}`;
  }
  if (url) return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
  if (media.filename) return `${API_URL}/api/media/file/${media.filename}`;
  return "";
}
