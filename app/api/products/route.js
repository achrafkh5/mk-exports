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
    const products = await db.collection("products").find({ companyId: id }).toArray();

    if (products.length === 0) {
      return NextResponse.json({ products, message: "no product found" }, { status: 200 });
    }
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const verify = verifyAuth();
    const body = await request.json();
    const { description, name,companyId,price,avatar,categoryId } = body;// 

    if (!description || !name|| !avatar?.url || !avatar?.public_id|| !companyId || !categoryId) {
      return NextResponse.json({ error: "description, name, and avatar (url, public_id) are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shop");
    const date = new Date();
    const product = {  name,companyId,description,price, createdAt:date,avatar,categoryId };
    const result = await db.collection("products").insertOne(product);

    product._id = result.insertedId;

    return NextResponse.json({
      message: "product created successfully",
      product
    }, { status: 200 });
  } catch (error) {
    console.error("Error during creating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    const verify = verifyAuth();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "product id is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shop");

    const product = await db.collection("products").findOne({ _id: new ObjectId(String(id)) });
    if (!product) {
      return NextResponse.json({ error: "product not found" }, { status: 404 });
    }

    // Delete product image
    if (product.avatar?.public_id) {
      await cloudinary.uploader.destroy(product.avatar.public_id);
    }

    // Delete product
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(String(id)) });

    return NextResponse.json({ message: "product and image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during deleting product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const verify = verifyAuth();
    const body = await request.json();
    const date =new Date();
    const { id,price,name,description,avatar } = body;

    if (!id || !price || !name||!description||!avatar ) {
      return NextResponse.json({ error: "id and price are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("shop");

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(String(id)) },
      { $set: { price,name,description,avatar,createdAt:date } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Product not found" },{status:404});
    }

    return NextResponse.json({ message: "Product updated successfully" },{status:200});
  } catch (error) {
    console.error("Error during updating product:", error);
    return NextResponse.json({ error: "Internal Server Error" },{status:500});
  }
};

