import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  const protectedRoutes = ["/dashboard"]; // pages to protect

  const pathname = req.nextUrl.pathname;

  // If user tries to access protected route without token
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/email", req.url);
      return NextResponse.redirect(loginUrl); // redirect to login page
    }
  }

  return NextResponse.next();
}

// Apply middleware to selected routes
export const config = {
  matcher: [
    "/dashboard/:path*"
  ],
};
