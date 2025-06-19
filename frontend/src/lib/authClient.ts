"use client";
import { createAuthClient } from "better-auth/react";
import "dotenv/config";

export const authClient = createAuthClient({
	baseURL: process.env.BACKEND_URL || "http://localhost:3000", // Your Express backend
	fetchOptions: {
		credentials: "include", // Ensure cookies are sent with requests
	},
});

// Export hooks for easy use in components
export const { useSession, signIn, signOut } = authClient;
