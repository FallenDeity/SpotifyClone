import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest): Promise<NextResponse> {
	const token = await getToken({ req: request, secret: String(process.env.JWT_SECRET) });
	const { pathname } = request.nextUrl;
	console.log("middleware.ts: pathname:", pathname);
	if (token) {
		return NextResponse.next();
	}
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!token && pathname !== "/login") {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
