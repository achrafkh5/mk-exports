import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth"; 

export async function POST() {
  try {
    const user = verifyAuth();

    const response = NextResponse.json({ message: `${user.id} logged out successfully` });

    // Clear the cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
