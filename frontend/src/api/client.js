// =====================================================
// API Client Wrapper (fetch-based)
// =====================================================
// Centralized wrapper around fetch for backend requests.
// - Uses Vite proxy by default (so /api -> http://localhost:5000)
// - Includes cookies for session auth (connect.sid)
// - Normalizes JSON + HTML (<pre>Error: ...</pre>) error responses
// =====================================================

/**
 * Base URL for backend API requests.
 * IMPORTANT:
 * - Default is "" (relative) so Vite proxy can forward "/api/*" to the backend.
 * - If you set VITE_API_URL, it will use that instead.
 */
const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Extracts a readable message from an HTML error page.
 * Backend sometimes returns HTML with a <pre> block.
 */
function extractHtmlError(htmlText) {
  const text = String(htmlText || "");
  const match = text.match(/<pre>([\s\S]*?)<\/pre>/i);
  const pre = match ? match[1] : text;

  // Convert <br> to newlines and strip any leftover tags
  const cleaned = pre
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();

  // Usually first line has the actual error (e.g., "Error: Full name is required")
  return cleaned.split("\n")[0] || "Request failed";
}

/**
 * Wrapper function for API requests.
 *
 * @param {string} path - API endpoint path (e.g. "/api/auth/login")
 * @param {Object} options - Fetch configuration options
 * @returns {Promise<any>} Parsed response (JSON if possible, else text)
 * @throws {Error} When request fails or backend returns an error
 */
export const apiFetch = async (path, options = {}) => {
  const url = `${API_BASE}${path}`;

  const response = await fetch(url, {
    // MUST include cookies for session-based auth
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Read as text first, then decide how to parse
  const raw = await response.text();

  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }
  } else {
    // might be HTML or plain text
    data = raw || null;
  }

  if (!response.ok) {
    // Prefer JSON error: { error: "..."} or { message: "..." }
    if (contentType.includes("application/json")) {
      const msg = data?.error || data?.message || "Request failed";
      throw new Error(msg);
    }

    // If HTML error page, extract readable message
    if (contentType.includes("text/html")) {
      throw new Error(extractHtmlError(data));
    }

    // Fallback
    throw new Error(typeof data === "string" && data.trim() ? data.trim() : "Request failed");
  }

  // Success: return JSON if present, else return raw text (some endpoints may return empty)
  return contentType.includes("application/json")
    ? data
    : (typeof data === "string" ? data : null);
};