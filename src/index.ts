import "dotenv/config";
import prisma from "./config/database";
import { app } from "./app";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    // Only run app.listen() locally, NOT on Vercel
    if (process.env.NODE_ENV !== "production") {
      app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(
          `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
        );
        console.log(`Client URL: ${process.env.CLIENT_URL}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
