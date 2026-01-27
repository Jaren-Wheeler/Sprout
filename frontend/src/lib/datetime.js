export function nowIsoLocal() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`;
}

export function toDatetimeLocalValue(isoLike) {
  if (!isoLike) return "";
  return String(isoLike).slice(0, 16);
}

export function fromDatetimeLocalValue(value) {
  if (!value) return null;
  return `${value}:00`;
}

export function isPastDatetimeLocal(value) {
  if (!value) return false;
  const d = new Date(value);
  return d.getTime() < Date.now();
}