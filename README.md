# Mini Fruit Inventory App

## 🔐 Secure Authentication System Overview

This project demonstrates a authentication system built with Node.js, TypeScript, Express, and Prisma. It incorporates various security best practices to protect user data and prevent common web vulnerabilities.

### **🛡️ Key Features:**

1. **JWT (JSON Web Tokens)** for Authentication: Securely transmit user identity.

2. **Refresh Tokens:** Provide a mechanism for long-lived sessions without exposing access tokens for extended periods.

3. **HTTP-Only Cookies:** Store refresh tokens securely to prevent XSS attacks.

4. **Bcrypt for Password Hashing:** Store passwords securely using a strong, adaptive hashing algorithm.

5. **Password Strength Validation:** Enforce strong password policies during registration and changes.

6. **Rate Limiting:** Protect against brute-force attacks and denial-of-service (DoS) by limiting the number of requests from a single IP address.

7. **Account Lockout:** Temporarily lock accounts after multiple failed login attempts.

8. **Input Validation (Zod):** Validate incoming request data to prevent common injection attacks and ensure data integrity.

9. **CORS Configuration:** Properly configure Cross-Origin Resource Sharing to allow only trusted clients.

10. **Comprehensive Logging:** Log login attempts (successful and failed) for auditing and security monitoring.

11. **Prisma ORM:** Type-safe database access with MySQL.

12. **TypeScript:** Provides static type checking for more robust and maintainable code.

---

### **🧾 Project Structure:**

- `package.json`: Defines project dependencies and scripts.

- `tsconfig.json`: Configures TypeScript compiler options for the project.

- `prisma/schema.prisma`: Defines the database schema and Prisma models.

- `.env`: Stores environment variables (database connection, JWT secrets, etc.).

- `src/`: Contains the application's source code.

  - `src/app.ts` and `src/index.ts`: The main application entry point, setting up middleware and routes.

  - `src/config/`: Configuration files.

    - `database.ts`: Prisma client setup.

    - `jwt.ts`: JWT token generation and verification logic.

  - `src/controllers/`: Contains the business logic for authentication operations.

    - `auth.controller.ts`: Handles user registration, login, logout, etc.

    - `fruit.controller.ts`: Manages CRUD operations for fruit inventory, including listing, adding, updating, and deleting fruit records with pagination.

  - `src/middleware/`: Express middleware.

    - `auth.middleware.ts`: Authentication and authorization logic.

    - `rateLimiter.ts`: Rate limiting configurations.

    - `security.ts`: Security and CORS setup.

    - `validation.ts`: Request parameter validation using Zod.

  - `src/routes/`: Defines API routes.

    - `auth.routes.ts`:` Authentication-related API endpoints.

    - `fruit.routes.ts`:` Fruit-management-related API endpoints.

  - `src/utils/`: Utility functions.

    - `password.ts`: Password hashing, comparison, and strength validation.

    - `seed.ts`: Seeds the database with initial data, typically for development or testing purposes.

  - `src/fruit.csv`: Contains raw fruit inventory data used for seeding or importing into the database.

- `.gitignore`: Specifies files and folders Git should ignore (e.g., node_modules).

---

## Authentication Flow Diagram

[![](https://mermaid.ink/img/pako:eNqtVl1v4kYU_Su3fnIk4mCDgVhVJAjQpiW7aUhSacXLYF9gGnuGHY-zYaP8997xRyA2aV6KFIg999zPc4_9YoUyQiuwUvyeoQhxzNlasWQhgD5bpjQP-ZYJDdMJsBSmSgqNIgL7FlmonX_Sk6bpKDcdsfAxt_xCEcjwbPK8VZgeA4xHBjBmmi1ZimBf7-Z_zciusJxOTi8uRpMAXAduvs7v4Ixt-RnL9OZM4ZqnGhXYWYpKsARbgAnjcYv8p-kPqaIy3Khy4jnwwGIeMY1wJbaZBvubbFh1HLjcYPgIN6UbmGuFYq03YFe35qieeIiH0PEogG4F5Su4p6xg8kw5pmCbC2fFRTTlKtUlbDw6LUPmtl8kdVpmIqrl4zvwO0s3-3TsUah224MBvMXvUXyFprzcYxE2zO8cj1lYRzU3fQdmcg23eYcV01wKsOkOF_T1kT-DqLujoykdDRzw2m51WqSVj_zkYMrTKqfbcrBkOc_CkGizyuJ490uDE-cNTsQmR7A_oYHb_pQHpgsucW5KIyuyWu5gYtwezPJecFqc4409NkjXq-gxDEM610QspjOixzDU_In4O5O0N818DSNlQluDH5CgALBY78-vxJMpsTh5767LHDqmMSZolpuKolYPtcZkq9OjgCV1WtLua85oEnmaVQ01-7xx3bAgUOl6VkzlOIE-IdF7Irk-pd4lKt0LM2-p-E_Dp7JWg4yKJKvNwDg96NnDhx2JHKJdio1utOB-m9NkxlJdFHIUjw78hgKVMR3mnIU7SRII9h9_370XixpydYC8xRWp5OZzaNHltUMEkqqBKy_zq_9qdmGeu4iOBtgUY9xv4f86yqVRhTZ8_dPwf9-yFsxpDoc1EPnlIz-M8iYYFGSNhux1qciHbzaw_hwhiZxny-KRp0GZX5qslrBVxPDQ6NPw5op2cq8qdLIiVpwsFsIelrTLRTGAEdJSKvhVmzwvGotLQmoAhpOhGfA1j6IYf5hFth9Q8dXuHVsa-EElGLmmVCpR8flywwRVP9R1mBFGJUOkWqiwS3psKxnHqGoC57Wdg0NYoQ43mALxndGTTvE0YQ1xM6pdl3fP3U_y5q2Lpb5bLStBRcoZ0ZvGi4EuLOpIggsroH8jph4X1kK8kh01W853IrQCrTJsWUpm640VrGid6SrLF7F8R3m7S-8Q36RMKghGnOh8XbzX5K83LWutTOzSJXEC1aURLivwXNfPPVjBi_VsBW6n43h-1-t0fb_f6fe8lrWzgtNO13N6vfZ5x6e_Qd93X1vWzzymS-adge_1_YF73uv7vdd_Aa8U01Q?type=png)](https://mermaid.live/edit#pako:eNqtVl1v4kYU_Su3fnIk4mCDgVhVJAjQpiW7aUhSacXLYF9gGnuGHY-zYaP8997xRyA2aV6KFIg999zPc4_9YoUyQiuwUvyeoQhxzNlasWQhgD5bpjQP-ZYJDdMJsBSmSgqNIgL7FlmonX_Sk6bpKDcdsfAxt_xCEcjwbPK8VZgeA4xHBjBmmi1ZimBf7-Z_zciusJxOTi8uRpMAXAduvs7v4Ixt-RnL9OZM4ZqnGhXYWYpKsARbgAnjcYv8p-kPqaIy3Khy4jnwwGIeMY1wJbaZBvubbFh1HLjcYPgIN6UbmGuFYq03YFe35qieeIiH0PEogG4F5Su4p6xg8kw5pmCbC2fFRTTlKtUlbDw6LUPmtl8kdVpmIqrl4zvwO0s3-3TsUah224MBvMXvUXyFprzcYxE2zO8cj1lYRzU3fQdmcg23eYcV01wKsOkOF_T1kT-DqLujoykdDRzw2m51WqSVj_zkYMrTKqfbcrBkOc_CkGizyuJ490uDE-cNTsQmR7A_oYHb_pQHpgsucW5KIyuyWu5gYtwezPJecFqc4409NkjXq-gxDEM610QspjOixzDU_In4O5O0N818DSNlQluDH5CgALBY78-vxJMpsTh5767LHDqmMSZolpuKolYPtcZkq9OjgCV1WtLua85oEnmaVQ01-7xx3bAgUOl6VkzlOIE-IdF7Irk-pd4lKt0LM2-p-E_Dp7JWg4yKJKvNwDg96NnDhx2JHKJdio1utOB-m9NkxlJdFHIUjw78hgKVMR3mnIU7SRII9h9_370XixpydYC8xRWp5OZzaNHltUMEkqqBKy_zq_9qdmGeu4iOBtgUY9xv4f86yqVRhTZ8_dPwf9-yFsxpDoc1EPnlIz-M8iYYFGSNhux1qciHbzaw_hwhiZxny-KRp0GZX5qslrBVxPDQ6NPw5op2cq8qdLIiVpwsFsIelrTLRTGAEdJSKvhVmzwvGotLQmoAhpOhGfA1j6IYf5hFth9Q8dXuHVsa-EElGLmmVCpR8flywwRVP9R1mBFGJUOkWqiwS3psKxnHqGoC57Wdg0NYoQ43mALxndGTTvE0YQ1xM6pdl3fP3U_y5q2Lpb5bLStBRcoZ0ZvGi4EuLOpIggsroH8jph4X1kK8kh01W853IrQCrTJsWUpm640VrGid6SrLF7F8R3m7S-8Q36RMKghGnOh8XbzX5K83LWutTOzSJXEC1aURLivwXNfPPVjBi_VsBW6n43h-1-t0fb_f6fe8lrWzgtNO13N6vfZ5x6e_Qd93X1vWzzymS-adge_1_YF73uv7vdd_Aa8U01Q)

---

## Fruit Inventory Backend Architecture

[![](https://mermaid.ink/img/pako:eNqFVEtzmzAQ_is7OrkzDrYAG5tDZkrAvSR9xMml44uCRKzaSK4QSdNM_ntXgB-165QTaL7d77FiX0muuSAxqcTPWqhcpJI9GlYuFOCzYcbKXG6YsjDLgFUwM1pZoTj0bgXLrfej-nAKTRpowvJVg_yMDAgcZL82RlT_KkgTV5Ayyx5YJaB38zL_do24FjnLLi4vkywG6sGtk1lZsBoqIYCt11CYWtoKep-yOxiwjRy0Bx1Nsi32PbhainwFsgDTdZEVPLG15AfQNIkh8OBjtQK-1VNo07G0wDS56JqGHsydxwf02kJgLSu764ewGcJGHWyPcAaKLssDlw48RvBSP299aQV2KaDKjRDqJJIIpXIODJToKqD39cv83SQmB0k4jy6GXJebtbDiKIkpamFP4qC7VLtcjsOgQ2ysVSFN2YEZ54Ifh0FxjHeiGVx3lxD5jPOv6jzH-1HU69PJ40juN0iMI9_ZvP_L5SCW_NgpDQ-sOg9SFfrc1Olox_F_q-O91bqt4VqJE6vRGattDT_1iYGnwg1i7zPNrrO77D2rTr0_dD9HqZ-26pGyPKvfp3v93PFJrY7F-_4Z8U2BE0_6pBSmZJLjAnl19QuCd7UUCxLjK2dmtSAL9YY4Vls9f1E5ia2pRZ8YXT8uSVywdYVfbRzd6tmd4mr4rnW5LRFcWm1u2nXVbK0-eTSOu2uJEoW50rWyJA6CYNJ0IPEr-UViOhx6U38SjCgdj6NxQGmfvODxxPeiKAh9GvmBT0M_eOuT3w0p9Wg4CsMwmAZ0FE1H07c_KFeVBg?type=png)](https://mermaid.live/edit#pako:eNqFVEtzmzAQ_is7OrkzDrYAG5tDZkrAvSR9xMml44uCRKzaSK4QSdNM_ntXgB-165QTaL7d77FiX0muuSAxqcTPWqhcpJI9GlYuFOCzYcbKXG6YsjDLgFUwM1pZoTj0bgXLrfej-nAKTRpowvJVg_yMDAgcZL82RlT_KkgTV5Ayyx5YJaB38zL_do24FjnLLi4vkywG6sGtk1lZsBoqIYCt11CYWtoKep-yOxiwjRy0Bx1Nsi32PbhainwFsgDTdZEVPLG15AfQNIkh8OBjtQK-1VNo07G0wDS56JqGHsydxwf02kJgLSu764ewGcJGHWyPcAaKLssDlw48RvBSP299aQV2KaDKjRDqJJIIpXIODJToKqD39cv83SQmB0k4jy6GXJebtbDiKIkpamFP4qC7VLtcjsOgQ2ysVSFN2YEZ54Ifh0FxjHeiGVx3lxD5jPOv6jzH-1HU69PJ40juN0iMI9_ZvP_L5SCW_NgpDQ-sOg9SFfrc1Olox_F_q-O91bqt4VqJE6vRGattDT_1iYGnwg1i7zPNrrO77D2rTr0_dD9HqZ-26pGyPKvfp3v93PFJrY7F-_4Z8U2BE0_6pBSmZJLjAnl19QuCd7UUCxLjK2dmtSAL9YY4Vls9f1E5ia2pRZ8YXT8uSVywdYVfbRzd6tmd4mr4rnW5LRFcWm1u2nXVbK0-eTSOu2uJEoW50rWyJA6CYNJ0IPEr-UViOhx6U38SjCgdj6NxQGmfvODxxPeiKAh9GvmBT0M_eOuT3w0p9Wg4CsMwmAZ0FE1H07c_KFeVBg)

---

## 🧭 Auth API Endpoint Summary

| Method | Endpoint                  | Middleware                                | Body / Cookie                   | Description              |
| ------ | ------------------------- | ----------------------------------------- | ------------------------------- | ------------------------ |
| POST   | `/api/auth/register`      | `authLimiter`, `validate(registerSchema)` | `{ username, email, password }` | Register a new user      |
| POST   | `/api/auth/login`         | `authLimiter`, `validate(loginSchema)`    | `{ email, password }`           | Login and receive tokens |
| POST   | `/api/auth/refresh-token` | None                                      | Cookie: `refreshToken`          | Refresh access token     |
| POST   | `/api/auth/logout`        | `authenticate`                            | Cookie: `refreshToken`          | Logout and revoke token  |
| GET    | `/api/auth/profile`       | `authenticate`                            | None                            | Get current user profile |

## 🍎 Fruit API Endpoint Summary

| Method | Endpoint                      | Middleware                                                    | Body / Params / Query                                                             | Description                           |
| ------ | ----------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------- |
| GET    | `/api/fruit/fruits-inventory` | `authenticate`, `validate(paginationSchema)`                  | Query: `page`, `limit`                                                            | Get paginated fruit inventory         |
| GET    | `/api/fruit/fruits-name`      | `authenticate`                                                | None                                                                              | Get list of unique fruit names        |
| POST   | `/api/fruit/`                 | `authenticate`, `validate(fruitSchema)`                       | Body: `inventoryDate`, `productName`, `color`, `amount`, `unit`                   | Add a new fruit inventory record      |
| PUT    | `/api/fruit/:id`              | `authenticate`, `validate(idSchema)`, `validate(fruitSchema)` | Params: `id` <br> Body: `inventoryDate`, `productName`, `color`, `amount`, `unit` | Update a fruit inventory record by ID |
| DELETE | `/api/fruit/:id`              | `authenticate`, `validate(idSchema)`                          | Params: `id`                                                                      | Delete a fruit inventory record by ID |

## Setup and Running the Project:

1. **Clone the repository (or create files manually):**

First, ensure you have Node.js and npm/yarn installed.

Create a project directory and the files as provided in your prompt

2. **Install Dependencies:**

Navigate to your project directory and install the required packages

```bash
npm install
# or
yarn install
```

3. **Configure Environment Variables:**

Create a .env file in the root of your project and populate it with the provided content. Crucially, replace placeholder secrets with strong, randomly generated values.

```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/fruit_inventory"

# JWT Secrets
JWT_ACCESS_SECRET="your-super-secure-access-secret-at-least-32-chars"
JWT_REFRESH_SECRET="your-super-secure-access-secret-at-least-32-chars"
JWT_RESET_SECRET="your-super-secure-access-secret-at-least-32-chars"

# JWT Expiration
JWT_ACCESS_EXPIRE="15m"
JWT_RESET_EXPIRE="1h"

# Bcrypt
BCRYPT_ROUNDS=12

# App
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

PASSWORD="your-super-secure-secret"
```

**Important:** For JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, and JWT_RESET_SECRET use a strong password generator or a command like `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to generate secure, random strings.

4. **Set up Database:**

Ensure you have a MySQL database running and update the DATABASE_URL in your .env file accordingly.

5. **Generate Prisma Client and Migrate Database:**

Run the following commands to generate the Prisma client and apply your schema to the database:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

If you're in a production environment, you'd typically use npx prisma migrate deploy after generating a migration.

6. **Build the TypeScript Project:**

Compile your TypeScript code into JavaScript:

```bash
npm run build
# or
yarn build
```

7. **Start the Server:**

You can start the server in development mode (with nodemon for auto-reloading) or production mode:

- **Development Mode:**

```bash
npm run dev
# or
yarn dev
```

- **Production Mode:**

```bash
npm start
# or
yarn start
```

The server should start on the specified PORT (default `3000`).
