import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../config/database";
import { JWTService } from "../config/jwt";
import { PasswordService } from "../utils/password";

export class AuthController {
  /**
   * @method register
   * @description Handles user registration.
   * Creates a new user after validating input and hashing the password.
   */
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      const usernameLowerCase = username?.toLowerCase();

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username: usernameLowerCase }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            existingUser.email === email
              ? "Email already exists"
              : "Username already exists",
        });
      }

      // Validate password strength
      const passwordValidation =
        PasswordService.validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          success: false,
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors,
        });
      }

      // Hash password
      const hashedPassword = await PasswordService.hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          username: usernameLowerCase,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      // Log registration
      await prisma.loginLog.create({
        data: {
          userId: user.id,
          email: user.email,
          ipAddress: req.ip || "unknown",
          userAgent: req.get("User-Agent") || "unknown",
          success: true,
          reason: "User registration",
        },
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @method login
   * @description Handles user login.
   * Authenticates user credentials, manages failed login attempts, and issues JWTs.
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || "unknown";
      const userAgent = req.get("User-Agent") || "unknown";

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Always log the attempt
      const logData = {
        userId: user?.id,
        email,
        ipAddress,
        userAgent,
        success: false,
        reason: "",
      };

      if (!user) {
        logData.reason = "User not found";
        await prisma.loginLog.create({ data: logData });

        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        logData.reason = "Account deactivated";
        await prisma.loginLog.create({ data: logData });

        return res.status(401).json({
          success: false,
          message: "Account has been deactivated",
        });
      }

      // Check if account is locked
      if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        logData.reason = "Account locked";
        await prisma.loginLog.create({ data: logData });

        return res.status(423).json({
          success: false,
          message:
            "Account is temporarily locked due to too many failed attempts",
        });
      }

      // Verify password
      const isPasswordValid = await PasswordService.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        // Increment failed attempts
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: user.failedLoginAttempts + 1,
            lockoutUntil:
              user.failedLoginAttempts + 1 >= 5
                ? new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
                : null,
          },
        });

        logData.reason = `Invalid password (attempt ${updatedUser.failedLoginAttempts})`;
        await prisma.loginLog.create({ data: logData });

        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Reset failed attempts on successful login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null,
          lastLoginAt: new Date(),
          lastLoginIP: ipAddress,
        },
      });

      // Generate tokens
      const accessToken = JWTService.generateAccessToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      const refreshToken = JWTService.generateRefreshToken();

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Log successful login
      logData.success = true;
      logData.reason = "Successful login";
      await prisma.loginLog.create({ data: logData });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // must be true with sameSite: 'none'
        sameSite: "none", // allow cross-site cookies
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @method refreshToken
   * @description Handles refreshing access tokens using a valid refresh token.
   */
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token not found",
        });
      }

      // if (!refreshToken) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "Refresh token not found",
      //   });
      // }

      // Find and validate refresh token
      const tokenRecord = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          isRevoked: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!tokenRecord || !tokenRecord.user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      // Generate new access token
      const accessToken = JWTService.generateAccessToken({
        userId: tokenRecord.user.id,
        username: tokenRecord.user.username,
        role: tokenRecord.user.role,
      });

      res.json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @method logout
   * @description Handles user logout.
   * Revokes the refresh token and clears the refresh token cookie.
   */
  static async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      if (refreshToken) {
        // Revoke refresh token
        await prisma.refreshToken.updateMany({
          where: {
            token: refreshToken,
            userId: req.user!.userId,
          },
          data: {
            isRevoked: true,
          },
        });
      }

      // Clear cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/", // default 
      });

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @method getProfile
   * @description Retrieves the profile information of the authenticated user.
   */
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        // Select specific fields to return, exclude sensitive ones like password
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
