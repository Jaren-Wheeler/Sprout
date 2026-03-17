import { z } from 'zod';

const num = (label, max) =>
  z.preprocess(
    (v) => {
      if (v === '' || v === undefined) return undefined;

      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    },
    z
      .number({
        invalid_type_error: `${label} must be a number`,
      })
      .min(0, `${label} cannot be negative`)
      .max(max, `${label} too high`)
  );

export const fitnessProfileSchema = z.object({
  currentWeight: z
    .number()
    .min(70, 'Weight must be at least 70 lbs')
    .max(700, 'Weight cannot exceed 700 lbs'),

  goalWeight: z
    .number()
    .min(70, 'Goal weight must be at least 70 lbs')
    .max(700, 'Goal weight cannot exceed 700 lbs'),

  calorieGoal: z
    .number()
    .min(800, 'Calories too low')
    .max(8000, 'Calories too high'),

  proteinGoal: z
    .number()
    .min(0, 'Protein cannot be negative')
    .max(500, 'Protein too high'),

  carbsGoal: z
    .number()
    .min(0, 'Carbs cannot be negative')
    .max(800, 'Carbs too high'),

  fatGoal: z.number().min(0, 'Fat cannot be negative').max(300, 'Fat too high'),

  age: z
    .number()
    .min(13, 'Must be 13 or older')
    .max(110, 'Age must be under 110'),

  heightFt: z
    .number()
    .min(3, 'Please enter a valid height')
    .max(8, 'Please enter a valid height'),

  heightIn: z.number().min(0).max(11, 'Inches must be between 0 and 11'),
});

export const createDietSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Diet name is required')
    .max(30, 'Diet name cannot exceed 30 characters'),
});

export const manualFoodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Food name must be at least 2 characters')
    .max(60, 'Food name cannot exceed 60 characters'),

  calories: num('Calories', 5000),

  protein: num('Protein', 400).optional(),

  carbs: num('Carbs', 600).optional(),

  fat: num('Fat', 300).optional(),

  sugar: num('Sugar', 300).optional(),
});
