import { API_BASE_URL } from "@/lib/api";

/**
 * Resolves a media path returned by the backend into a full URL.
 * - `null` / empty → returns `null` (caller shows fallback).
 * - Absolute URLs (http/https) are returned as-is.
 * - Relative paths (e.g. `/uploads/...`) are prefixed with the API origin
 *   because static assets are served by the backend, not the Next app.
 */
export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${normalized}`;
}
