"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/authClient";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const { data, error } = await authClient.signIn.email({
				email,
				password,
			});

			if (error) {
				setError(error.message || "Login failed");
				return;
			}

			router.push("/habits");
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		setError(null);

		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/habits",
			});
		} catch (err) {
			setError("Google login failed");
			setIsLoading(false);
		}
	};

	const handleForgotPassword = async () => {
		const email = (document.getElementById("email") as HTMLInputElement)
			?.value;

		if (!email) {
			setError("Please enter your email address first");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const { error } = await authClient.forgetPassword({
				email,
				redirectTo: "/reset-password",
			});

			if (error) {
				setError(error.message || "Failed to send reset email");
				return;
			}

			setError("Password reset email sent! Check your inbox.");
		} catch (err) {
			setError("Failed to send reset email");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							{error && (
								<div
									className={`p-3 text-sm border rounded-md ${
										error.includes("sent")
											? "text-green-600 bg-green-50 border-green-200"
											: "text-red-600 bg-red-50 border-red-200"
									}`}
								>
									{error}
								</div>
							)}
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Email"
									required
									disabled={isLoading}
								/>
							</div>
							<div className="grid gap-3">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<button
										type="button"
										onClick={handleForgotPassword}
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline disabled:opacity-50"
										disabled={isLoading}
									>
										Forgot your password?
									</button>
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Password"
									required
									disabled={isLoading}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading ? "Logging in..." : "Login"}
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full bg-white text-black"
									onClick={handleGoogleSignIn}
									disabled={isLoading}
								>
									{isLoading
										? "Loading..."
										: "Login with Google"}
								</Button>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<a
								href="/register"
								className="underline underline-offset-4"
							>
								Register
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
