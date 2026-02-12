import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/auth/sign-in";

  // 🔐 Not logged in → block dashboard pages
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // ✅ Logged in → block login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
