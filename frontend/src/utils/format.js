export function formatCurrency(value) {
  if (!value || isNaN(Number(value))) return '';

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(Number(value));
}

export function stripCurrencyFormatting(value) {
  if (!value) return '';
  return value.replace(/[^0-9.]/g, '');
}
