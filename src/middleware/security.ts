import cors from 'cors';
import { Express } from 'express';

/**
 * @function setupSecurity
 * @description Configures various security middleware for the Express application.
 * This includes configuring CORS (Cross-Origin Resource Sharing).
 * @param {Express} app - The Express application instance.
 */
export const setupSecurity = (app: Express) => {
  // CORS (Cross-Origin Resource Sharing) configuration.
  // This middleware enables secure cross-origin requests.
  const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., from mobile apps, curl requests, or same-origin requests)
      if (!origin) return callback(null, true);
      // Check if the requesting origin is in the list of allowed origins
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies (like the refresh token cookie) to be sent with cross-origin requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'] // Allowed headers
  }));
};
