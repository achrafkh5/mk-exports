import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";

/*export async function POST(request) {
  try {
    const body = await request.json();
  const { password, email } = body;
  if (!password || !email) {
    return NextResponse.json({ error: "required all the inputs" },{status:404});
  }
  const client = await clientPromise;
    const db = client.db("shop");

    const checkEmail = await db.collection("users").findOne({email});
    if(checkEmail) return NextResponse.json({ error: "Email found" },{status:409});


    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.collection("users").insertOne({
      password: hashedPassword,
      email,
    });
    console.log(`User ${email} signed up successfully`);
    return NextResponse.json({ message: "User created successfully" },{status:201});
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ error: "Internal Server Error" },{status:500});
  }
};*/