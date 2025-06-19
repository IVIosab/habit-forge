"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/authClient"

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		const formData = new FormData(e.currentTarget)
		const name = formData.get("name") as string
		const email = formData.get("email") as string
		const password = formData.get("password") as string

		try {
			const { data, error } = await authClient.signUp.email({
				email,
				password,
				name
			})

			if (error) {
				setError(error.message || "Registration failed")
				return
			}

			router.push("/login")
		} catch (err) {
			setError("An unexpected error occurred")
		} finally {
			setIsLoading(false)
		}
	}

	const handleGoogleSignUp = async () => {
		setIsLoading(true)
		setError(null)

		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/login"
			})
		} catch (err) {
			setError("Google registration failed")
			setIsLoading(false)
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Register</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							{error && (
								<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
									{error}
								</div>
							)}
							<div className="grid gap-3">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="John Doe"
									required
									disabled={isLoading}
								/>
							</div>
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
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Password: 8-64 characters"
									required
									disabled={isLoading}
									minLength={6}
									maxLength={64}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Registering..." : "Register"}
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full bg-white text-black"
									onClick={handleGoogleSignUp}
									disabled={isLoading}
								>
									{isLoading ? "Loading..." : "Register with Google"}
								</Button>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<a href="/login" className="underline underline-offset-4">
								Login
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
