import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // better than jsonwebtoken for edge/middleware

const PUBLIC_PATHS = ["/login", "/signup", "/contact","/shop","/"]; // pages that don’t need auth

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (
  pathname === "/" || 
  PUBLIC_PATHS.some((path) => path !== "/" && pathname.startsWith(path))
) {
  return NextResponse.next();
}


  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify token with jose (works in middleware)
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next(); // ✅ Auth ok → allow page
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply only to protected paths
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*","/admin"], // protect these
};
