import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url); 
    const id = searchParams.get("id");

    const client = await clientPromise;
    const db = client.db("shop"); 
    const category = await db.collection("categories").findOne({ _id: new ObjectId(id) });

if (!category) {
  return NextResponse.json({ message: "Category not found" }, { status: 404 });
}

return NextResponse.json(category, { status: 200 });

  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}