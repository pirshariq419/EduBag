/**
 * Resolves an image path for display in the admin panel.
 * 
 * Images stored in the DB may be:
 *   1. Relative paths like "/images/gmcsgr.jpg" (served by the frontend)
 *   2. Full URLs like "https://..." or "data:image/..." (already complete)
 * 
 * For case 1, we prepend the frontend origin so the admin panel can load them.
 */

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export function resolveImageUrl(path: string | undefined | null): string {
  if (!path) return "";
  // Already a full URL or data URI — return as-is
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  // Relative path — prefix with frontend origin
  return `${FRONTEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
