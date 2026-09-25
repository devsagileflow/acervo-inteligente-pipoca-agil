import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidAdminToken } from "./lib/admin-auth";

/**
 * Routes that require a valid admin access token via the `hash` query parameter.
 */
const PROTECTED_ADMIN_ROUTES = ["/metricas"];

function isProtectedAdminRoute(pathname: string): boolean {
  return PROTECTED_ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (!isProtectedAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const hash = searchParams.get("hash");

  if (!isValidAdminToken(hash)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/metricas/:path*"],
};
