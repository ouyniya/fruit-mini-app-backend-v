import { z } from "zod";
import { Request, Response, NextFunction } from "express";

interface ValidationSchemas {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

// Validation Schemas
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a positive integer")
    .transform(Number)
    .refine((n) => n > 0, { message: "Page must be greater than 0" })
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, {
      message: "Limit must be between 1 and 100",
    })
    .optional(),
});

export const idSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a positive integer")
    .transform(Number)
    .refine((n) => n > 0, { message: "ID must be greater than 0" }),
});

export const fruitSchema = z.object({
  inventoryDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),

  productName: z.string().min(1, { message: "Fruit name is required" }),

  color: z.string().min(1, { message: "Color is required" }),

  amount: z
    .number({ message: "Amount must be a number" })
    .nonnegative({ message: "Amount must be non-negative" }),

  unit: z
    .number({ message: "Unit price must be a number" })
    .nonnegative({ message: "Unit price must be non-negative" }),
});

// Validation Middleware
export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        schemas.body.parse(req.body);
      }

      if (schemas.query) {
        schemas.query.parse(req.query);
      }

      if (schemas.params) {
        schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
