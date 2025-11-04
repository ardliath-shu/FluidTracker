import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { createPool } from "mysql2/promise";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  database: createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA || "database",
    timezone: "Z", // Important to ensure consistent timezone values
  }),
  advanced: {
    database: {
      useNumberId: true,
    },
  },
  session: {
    // Set the max age of the session
    maxAge: 3600, // 1 hour (in seconds)
  },
  plugins: [nextCookies()],
});
