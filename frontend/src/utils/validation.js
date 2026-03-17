/*
==================================================
Converts Zod validation errors into
field:error map that forms can display.
==================================================
*/

export function parseZodErrors(zodError) {
  const errors = {};

  const issues = zodError?.issues || zodError?.errors || [];

  issues.forEach((err) => {
    const field = err.path?.[0];
    if (field) {
      errors[field] = err.message;
    }
  });

  return errors;
}
