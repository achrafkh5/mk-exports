import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import cloudinary from "@/lib/cloudinary";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    const verify = verifyAuth();
    const client = await clientPromise;
    const db = client.db("shop"); 
    const categories = await db.collection("categories").find({}).toArray();

    if (categories.length === 0) {
      return NextResponse.json({ categories, message: "no category found" }, { status: 200 });
    }
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const verify = verifyAuth();
    const body = await request.json();
    const date = new Date();
    const { name,avatar } = body;
    if (!name || !avatar ) {
      return NextResponse.json({ error: "name and avatar are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shop");

    const category = { name,avatar, createdAt:date };
    const result = await db.collection("categories").insertOne(category);

    category._id = result.insertedId;

    return NextResponse.json({
      message: "Category created successfully",
      category
    }, { status: 200 });
  } catch (error) {
    console.error("Error during creating category:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(request) {
  const verify = verifyAuth();
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shop");

    const category = await db.collection("categories").findOne({ _id: new ObjectId(String(id)) });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Delete category image
    if (category.avatar?.public_id) {
      await cloudinary.uploader.destroy(category.avatar.public_id);
    }

    // Delete dish images
    const companies = await db.collection("companies").find({ categoryId: id }).toArray();
    for (const dish of companies) {
      if (dish.avatar?.public_id) {
        await cloudinary.uploader.destroy(dish.avatar.public_id);
      }
    }
    await db.collection("companies").deleteMany({ categoryId: id });

    const products = await db.collection("products").find({ categoryId: id }).toArray();
    for (const dish of products) {
      if (dish.avatar?.public_id) {
        await cloudinary.uploader.destroy(dish.avatar.public_id);
      }
    }
    await db.collection("products").deleteMany({ categoryId: id });

    // Delete category
    const result = await db.collection("categories").deleteOne({ _id: new ObjectId(String(id)) });

    return NextResponse.json({ message: "Category, companies, and images deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during deleting category:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const verify = verifyAuth();
  try {
    const body = await request.json();
    const { id, name,avatar } = body;
    const date = new Date();
    if (!id || !name||!avatar ) {
      return NextResponse.json({ error: "id, name  are required" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("shop");
    const category = await db.collection("categories").findOne({ _id: new ObjectId(String(id)) });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(String(id)) },
      { $set: { name,avatar,createdAt:date } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made to the category" }, { status: 200 });
    }
    return NextResponse.json({ message: "Category updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during updating category:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }}

