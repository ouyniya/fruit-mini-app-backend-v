import bcrypt from "bcryptjs";

export class PasswordService {
  private static readonly SALT_ROUNDS = parseInt(
    process.env.BCRYPT_ROUNDS || "12"
  );

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  // Verify password
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    // Check for common passwords
    const commonPasswords = [
      "password",
      "123456",
      "123456789",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "12345678",
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push(
        "Password is too common. Please choose a more secure password"
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
