import { NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: Request) {
	const sessionCookie = getSessionCookie(request)
	const url = new URL(request.url)
	if (!sessionCookie && !["/", "/login", "/register"].includes(url.pathname)) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	if (sessionCookie && ["/", "/login", "/register"].includes(url.pathname)) {
		return NextResponse.redirect(new URL("/habits", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.css$).*)"
	]
}
