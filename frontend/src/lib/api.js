//frontend/src/lib/api.js
import axios from "axios";

/**
 * Centralized Axios instance for the app.
 *
 * Works with either:
 * 1) VITE_API_BASE_URL="http://localhost:8080"     (recommended)
 * 2) VITE_API_BASE_URL="http://localhost:8080/api" (still works; we auto-fix /api/api)
 * 3) VITE_API_BASE_URL="" and Vite proxy handles /api routes
 */
const RAW_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const NORMALIZED_BASE = RAW_BASE.replace(/\/+$/, ""); // trim trailing slashes

const api = axios.create({
  baseURL: NORMALIZED_BASE || "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/**
 * Fix common baseURL/url mismatches:
 * - If baseURL ends with "/api" and request url starts with "/api",
 *   rewrite "/api/xxx" -> "/xxx" so we don't hit "/api/api/xxx".
 */
api.interceptors.request.use((config) => {
  const base = (config.baseURL ?? "").replace(/\/+$/, "");
  const url = String(config.url ?? "");

  const baseEndsWithApi = /\/api$/.test(base);
  const urlStartsWithApi = /^\/api(\/|$)/.test(url);

  if (baseEndsWithApi && urlStartsWithApi) {
    config.url = url.replace(/^\/api/, "");
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;