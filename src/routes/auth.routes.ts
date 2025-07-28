import { Router } from "express";
import { AuthController } from "../controllers/auth.controller"; // Authentication controller
import { authenticate, authorize } from "../middleware/auth.middleware"; // Auth and authorization middleware
import {
  validate,
  registerSchema,
  loginSchema,
} from "../middleware/validation"; // Validation middleware and schemas
import { authLimiter } from "../middleware/rateLimiter"; // Rate limiters

const router = Router();

// --- Public routes (accessible without authentication) ---

// User registration route
// Applies authentication-specific rate limiting and input validation.
router.post(
  "/register",
  authLimiter, // Apply strict rate limiting to prevent brute-force registrations
  validate({ body: registerSchema }), // Validate request body against register schema
  AuthController.register // Handle registration logic
);

// User login route
// Applies authentication-specific rate limiting and input validation.
router.post(
  "/login",
  authLimiter, // Apply strict rate limiting to prevent brute-force login attempts
  validate({ body: loginSchema }), // Validate request body against login schema
  AuthController.login // Handle login logic
);

// Refresh token route
// Allows clients to obtain a new access token using a valid refresh token.
router.post("/refresh-token", AuthController.refreshToken);

// --- Protected routes (require authentication) ---

// User logout route
// Requires a valid access token to log out.
router.post("/logout", authenticate, AuthController.logout);

// Get user profile route
// Requires authentication to retrieve user's own profile data.
router.get("/profile", authenticate, AuthController.getProfile);

export default router;
