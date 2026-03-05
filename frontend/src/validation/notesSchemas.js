import { z } from 'zod';

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Max 120 characters'),

  content: z
    .string()
    .trim()
    .min(1, 'Note cannot be empty')
    .max(20000, 'Note is too long'),
});
