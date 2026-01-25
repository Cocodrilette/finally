import { z } from "zod";

// Common schemas
export const uuidSchema = z.string().uuid("Invalid UUID format");

// High precision number schema for crypto assets with many decimals
export const highPrecisionNumberSchema = z
  .number()
  .min(0, "Must be zero or positive")
  .refine((val) => {
    // Allow numbers with up to 16 decimal places
    const str = val.toString();
    if (!str.includes('.')) return true;
    const decimals = str.split('.')[1];
    return decimals.length <= 16;
  }, "Maximum 16 decimal places allowed");

export const positiveNumberSchema = z.number().positive("Must be a positive number");
export const nonEmptyStringSchema = z.string().min(1, "Cannot be empty");

// Record schemas
export const recordDTOSchema = z.object({
  asset: nonEmptyStringSchema,
  currency: nonEmptyStringSchema,
  price: highPrecisionNumberSchema,
  shares: highPrecisionNumberSchema,
  user_id: uuidSchema,
  note: z.string().nullable().optional(),
});

// Expense schemas
export const expenseTypeSchema = z.enum(["recurring", "one-time"], {
  errorMap: () => ({ message: "Type must be 'recurring' or 'one-time'" }),
});

export const expenseDTOSchema = z.object({
  expense: nonEmptyStringSchema,
  value: highPrecisionNumberSchema,
  currency: nonEmptyStringSchema,
  payment_method: z.string().optional(),
  payment_date: z.string().datetime().optional(),
  payment_day: z.number().min(1).max(31).optional(),
  type: expenseTypeSchema,
  user_id: uuidSchema,
});

// API response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Validation helper
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: `${firstError.path.join(".")}: ${firstError.message}`,
      };
    }
    return { success: false, error: "Validation failed" };
  }
}
