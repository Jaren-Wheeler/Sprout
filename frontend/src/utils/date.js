// =====================================================
// Date Utilities
// =====================================================
// Helper functions for generating ISO date ranges
// and formatting dates for UI inputs.
// =====================================================


/**
 * Returns ISO start and end timestamps for the
 * current calendar month.
 */
export function getCurrentMonthRange() {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    from: start.toISOString(),
    to: end.toISOString()
  };
}


/**
 * Returns ISO start and end timestamps for the month
 * containing the given date.
 */
export function getMonthRange(dateInput) {
  const date = new Date(dateInput);

  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    from: start.toISOString(),
    to: end.toISOString()
  };
}


/**
 * Formats a date into YYYY-MM-DD for input fields.
 */
export function formatDateForInput(dateInput) {
  const date = new Date(dateInput);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}
