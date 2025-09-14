import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyAuth() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  if (!token) {
    console.log("user not authenticated")
    throw new Error("Not authenticated");
  }

  try {
    
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    console.log("user authenticated", userId)
    return userId; // return user payload
    
  } catch (err) {
    throw new Error("Invalid token");
    
  }
}
