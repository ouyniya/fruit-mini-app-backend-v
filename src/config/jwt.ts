import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class JWTService {
  private static accessSecret = process.env.JWT_ACCESS_SECRET!;
  private static resetSecret = process.env.JWT_RESET_SECRET!;

  // Generate Access Token (Short-lived)
  static generateAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m",
      issuer: "fruit-inventory",
      audience: "fruit-inventory-client",
    } as jwt.SignOptions);
  }

  // Generate Refresh Token (Long-lived)
  static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  // Verify Access Token
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.accessSecret, {
        issuer: "fruit-inventory",
        audience: "fruit-inventory-client",
      }) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }

  // Extract token from Authorization header
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    return authHeader.substring(7);
  }
}
