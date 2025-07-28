import { Request, Response, NextFunction } from "express";
import { JWTService, JWTPayload } from "../config/jwt";
import prisma from "../config/database";

// Extend the Express Request interface to include a 'user' property.
// This allows authenticated user information to be attached to the request object
// and passed down to subsequent middleware and route handlers.
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

/**
 * @function authenticate
 * @description Middleware to verify JWT access tokens and attach user information to the request.
 * This ensures that only authenticated users can access protected routes.
 * @param {AuthenticatedRequest} req - The Express request object, extended with a potential 'user' property.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Extract token from Authorization header (e.g., "Bearer <token>")
    const token = JWTService.extractTokenFromHeader(req.headers.authorization);

    // If no token is found, return 401 Unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // 2. Verify the access token
    // This will throw an error if the token is invalid or expired.
    const payload: JWTPayload = JWTService.verifyAccessToken(token);

    // 3. Check if user still exists and is active in the database
    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
        isActive: true, // Ensure the user account is active
      },
    });

    // If user is not found or is inactive, return 401 Unauthorized
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    // 4. Security check: Invalidate token if issued before last password change
    // This prevents old tokens from being used after a user has changed their password.
    const tokenIssuedAt = new Date(payload.iat! * 1000); // JWT 'iat' is in seconds, convert to milliseconds
    if (user.passwordChangedAt && tokenIssuedAt < user.passwordChangedAt) {
      return res.status(401).json({
        success: false,
        message: "Password has been changed. Please login again",
      });
    }

    // 5. Attach user information to the request object
    req.user = {
      userId: user.id,
      username: user.username,
      role: user.role, // Attach user's role for authorization checks
    };

    // 6. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Catch errors from token verification (e.g., JsonWebTokenError, TokenExpiredError)
    // and return a 401 Unauthorized response.
    console.error("Authentication error:", (error as Error).message); // Log the specific error
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * @function authorize
 * @description Middleware to enforce role-based access control.
 * It checks if the authenticated user's role is included in the allowed roles list.
 * @param {string[]} roles - An array of roles that are allowed to access the route.
 * @returns {Function} An Express middleware function.
 */
export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Check if user information is present on the request (meaning authentication middleware ran successfully)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required", // Should ideally not happen if 'authenticate' runs before this
      });
    }

    // 2. Check if the authenticated user's role is among the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions", // 403 Forbidden
      });
    }

    // 3. If authorized, proceed to the next middleware or route handler
    next();
  };
};
