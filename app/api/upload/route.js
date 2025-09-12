import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { Readable } from "stream";

export async function POST(req) {
  try {
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
