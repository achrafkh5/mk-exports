import { NextResponse } from "next/server";
//import clientPromise from "@/lib/mongodb";
//import { ObjectId } from "mongodb";
//import cloudinary from "@/lib/cloudinary";
//import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  const date = new Date();
      return NextResponse.json({ date,message: "im here" }, { status: 200 });

}