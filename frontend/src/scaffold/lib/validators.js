export function requiredText(label, value) {
  const v = (value ?? "").toString().trim();
  if (!v) return `${label} is required.`;
  return null;
}

export function numberNonNegative(label, value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  if (Number.isNaN(n)) return `${label} must be a number.`;
  if (n < 0) return `${label} must be non-negative.`;
  return null;
}

export function endAfterStart(labelEnd, startValue, endValue) {
  if (!endValue) return null;
  if (!startValue) return null;
  const s = new Date(startValue).getTime();
  const e = new Date(endValue).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return null;
  if (e <= s) return `${labelEnd} must be after start time.`;
  return null;
}
