import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import cloudinary from "@/lib/cloudinary";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url); 
    const id = searchParams.get("id");

    const client = await clientPromise;
    const db = client.db("shop"); 
    const companies = await db.collection("companies").find({ categoryId: id }).toArray();

    if (companies.length === 0) {
      return NextResponse.json({ companies, message: "no company found" }, { status: 200 });
    }
    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const verify = await verifyAuth();
    const body = await request.json();
    const { categoryId , name , avatar } = body;//
    if (!categoryId || !name || !avatar?.url || !avatar?.public_id) {
      return NextResponse.json({ error: "categoryId, name are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shop");
    const date = new Date();
    const company = { categoryId, name, createdAt:date ,avatar};
    const result = await db.collection("companies").insertOne(company);

    company._id = result.insertedId;

    return NextResponse.json({
      message: "company created successfully",
      company
    }, { status: 200 });
  } catch (err) {
    console.error("Error during creating company:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(request) {
  const verify = await verifyAuth();
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "company id is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shop");

    const company = await db.collection("companies").findOne({ _id: new ObjectId(String(id)) });
    if (!company) {
      return NextResponse.json({ error: "company not found" }, { status: 404 });
    }

    // Delete company image
    if (company.avatar?.public_id) {
      await cloudinary.uploader.destroy(company.avatar.public_id);
    }

    // Delete dish images
    const products = await db.collection("products").find({ companyId: id }).toArray();
    for (const dish of products) {
      if (dish.avatar?.public_id) {
        await cloudinary.uploader.destroy(dish.avatar.public_id);
      }
    }
    await db.collection("products").deleteMany({ companyId: id });

    // Delete company
    const result = await db.collection("companies").deleteOne({ _id: new ObjectId(String(id)) });

    return NextResponse.json({ message: "company, products, and images deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during deleting company:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const verify = await verifyAuth();
  try {
    const body = await request.json();
    const { id, name,avatar } = body;
    const date = new Date();
    if (!id || !name||!avatar ) {
      return NextResponse.json({ error: "id, name  are required" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("shop");
    const company = await db.collection("companies").findOne({ _id: new ObjectId(String(id)) });
    if (!company) {
      return NextResponse.json({ error: "company not found" }, { status: 404 });
    }
    const result = await db.collection("companies").updateOne(
      { _id: new ObjectId(String(id)) },
      { $set: { name,avatar,createdAt:date } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made to the company" }, { status: 200 });
    }
    return NextResponse.json({ message: "company updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during updating company:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }}