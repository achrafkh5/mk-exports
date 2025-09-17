import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { Readable } from "stream";
import { verifyAuth } from "@/lib/auth";
export async function POST(req) {
  try {
    const verify = await verifyAuth();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert Blob → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "test_uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    return NextResponse.json(
      {
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const verify = await verifyAuth();
    const body = await req.json();
    const { public_id } = body;
    if (!public_id) {
      return NextResponse.json({ error: "public_id is required" }, { status: 400 });
    }
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

