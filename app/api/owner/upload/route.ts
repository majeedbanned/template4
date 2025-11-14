import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import client from "@/lib/prismadb1";

export async function POST(req: NextRequest) {
  // ** Auth **
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized: Login required.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const moduleID = parseInt(formData.get("moduleID") as string);
    const CatID = parseInt(formData.get("CatID") as string);
    const pelak = formData.get("pelak") as string;
    const rowId = parseInt(formData.get("rowId") as string);
    const userID = parseInt(formData.get("userID") as string);

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Get file extension
    const originalExtension = file.name.split(".").pop() || "pdf";
    
    // Generate GUID filename
    const guidFileName = `${uuidv4()}.${originalExtension}`;
    
    // Define upload directory
    const uploadDir = join(process.cwd(), "public", "uploads", "owner");
    
    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk with GUID name
    const filePath = join(uploadDir, guidFileName);
    await writeFile(filePath, buffer);

    // Save file info to database
    const currentDate = new Date().toISOString();
    const response = await client.doc_files.create({
      data: {
        moduleID,
        CatID,
        name: guidFileName, // Store GUID filename
        date_: currentDate,
        userID,
        pelak,
        rowId,
      },
    });

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        data: response,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: error.message || "Error uploading file" },
      { status: 500 }
    );
  }
}
