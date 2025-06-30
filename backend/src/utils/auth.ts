import "dotenv/config"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"     

import * as schema from "../db/schema"
import { db } from "../db"

console.log("Initializing better-auth...")

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account
    }
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    passwordHash: {
      type: "scrypt" // Default in better-auth@1.2.8
    }
  },
  secret: process.env.BETTER_AUTH_SECRET || "your_default_secret",
  baseURL: process.env.BACKEND_URL || "http://localhost:3000",
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3001"],
  logger: {
    level: "debug" // Enable debug logging for Better Auth
  },
  plugins: [nextCookies()] // make sure this is the last plugin in the array
})

console.log("Better-auth initialized successfully")
