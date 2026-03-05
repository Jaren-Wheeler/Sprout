import { z } from 'zod';

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Event title is required')
    .max(80, 'Max 80 characters'),

  time: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => val === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(val), {
      message: 'Invalid time',
    }),
});
