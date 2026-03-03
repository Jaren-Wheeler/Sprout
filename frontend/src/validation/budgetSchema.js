import { z } from 'zod';

export const incomeSchema = z.object({
  income: z
    .string()
    .trim()
    .min(1, 'Monthly income is required')
    .refine((val) => !isNaN(Number(val)), {
      message: 'Income must be a valid number',
    })
    .refine((val) => Number(val) > 0, {
      message: 'Income must be greater than 0',
    }),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(20, 'Max 20 characters')
    .regex(/^[A-Za-z ]+$/, 'Letters only'),

  limitAmount: z
    .string()
    .trim()
    .min(1, 'Amount required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Enter a valid amount greater than 0',
    }),
});

export const transactionSchema = z
  .object({
    description: z
      .string()
      .trim()
      .max(50, 'Max 50 characters')
      .optional()
      .or(z.literal('')),

    amount: z
      .string()
      .trim()
      .min(1, 'Amount is required')
      .refine((val) => !isNaN(Number(val)), {
        message: 'Must be a valid number',
      })
      .refine((val) => Number(val) > 0, {
        message: 'Must be greater than 0',
      }),

    categoryId: z.string().optional(),

    type: z.enum(['expense', 'income']),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'expense' && !data.categoryId) {
      ctx.addIssue({
        path: ['categoryId'],
        code: z.ZodIssueCode.custom,
        message: 'Please select a category',
      });
    }
  });
