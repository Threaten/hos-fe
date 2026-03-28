import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Check if it's a subdomain
  // e.g., gold.localhost:3001 has a subdomain "gold"
  // e.g., red-bistro.houseofsenses.vn has a subdomain "red-bistro"
  // but localhost:3001 or houseofsenses.vn do not
  const parts = hostname.split(".");

  // Skip if it's the admin subdomain (backend)
  if (hostname.startsWith("admin.")) {
    return NextResponse.next();
  }

  let subdomain: string | null = null;

  // Development: tenant.localhost:3001
  if (hostname.includes("localhost") && parts.length > 1) {
    subdomain = parts[0];
  }
  // Production: tenant.houseofsenses.vn (more than 2 parts means subdomain exists)
  else if (parts.length > 2) {
    subdomain = parts[0];
  }

  // If we found a subdomain and it's not www, rewrite to tenant path
  if (subdomain && subdomain !== "www" && subdomain !== "admin") {
    const url = request.nextUrl.clone();

    // Rewrite to tenant-specific path
    const pathname = url.pathname;
    url.pathname = `/tenant/${subdomain}${pathname === "/" ? "" : pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
