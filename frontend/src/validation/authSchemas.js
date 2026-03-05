import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Full name is required')
      .max(40, 'Full name is too long')
      .regex(/^[A-Za-z]+(?: [A-Za-z]+)+$/, 'Full name is required'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),

    password: z.string().min(8, 'Password must be at least 8 characters'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
