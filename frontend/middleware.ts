import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	//implement some way of checking if the user is logged in and redirecting them to the login page if they are not

	return NextResponse.next();
}
