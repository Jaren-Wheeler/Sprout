export function nextId(list, idKey) {
  if (!Array.isArray(list) || list.length === 0) return 1;
  let max = 0;
  for (const item of list) {
    const v = Number(item?.[idKey] ?? 0);
    if (v > max) max = v;
  }
  return max + 1;
}
