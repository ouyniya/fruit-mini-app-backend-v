import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { setupSecurity } from "./middleware/security";
import { apiLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth.routes";
import fruitRoutes from "./routes/fruit.routes";

const app = express();

app.set("trust proxy", 1); // trust first proxy only

// Apply CORS configuration using the custom setupSecurity middleware.
setupSecurity(app);

app.use(apiLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/fruit", fruitRoutes);

// --- Global Error Handling Middleware ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Handler:", err.stack);
  console.error("Error middleware:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    // Only send the specific error message in development mode
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

export { app };
