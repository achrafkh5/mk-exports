import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" },{status:400});
  }
   const client = await clientPromise;
    const db = client.db("shop");
    let user;
    
      user = await db.collection("users").findOne({ email: username });
    if (!user) {
      return NextResponse.json({ error: "Invalid username" },{status:401});
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: "Invalid password" },{status:401});
    }
    const id=user._id
    const token = jwt.sign({id: user._id.toString()}, process.env.JWT_SECRET);

    console.log(`User ${username} logged in successfully`);
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60,
});
    console.log("Token set in cookie:", token);
    return response;
    
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Internal Server Error" },{status:500});
  }
};