import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import client from "@/lib/prismadb1";
import { readFile } from "fs/promises";
import { join } from "path";

// GET - Download a specific document
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized: Login required." },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(params.id);
    const document = await client.doc_files.findUnique({
      where: { id },
    });

    if (!document || !document.name) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Read file from disk
    const filePath = join(
      process.cwd(),
      "public",
      "uploads",
      "tenant",
      document.name
    );

    try {
      const fileBuffer = await readFile(filePath);
      
      // Determine content type based on file extension
      const extension = document.name.split(".").pop()?.toLowerCase();
      let contentType = "application/octet-stream";
      
      if (extension === "pdf") {
        contentType = "application/pdf";
      } else if (extension === "jpg" || extension === "jpeg") {
        contentType = "image/jpeg";
      } else if (extension === "png") {
        contentType = "image/png";
      } else if (extension === "doc") {
        contentType = "application/msword";
      } else if (extension === "docx") {
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }
// @ts-ignore: Unreachable code error
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${document.name}"`,
        },
      });
    } catch (fileError) {
      return NextResponse.json(
        { message: "File not found on disk" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error downloading document" },
      { status: 500 }
    );
  }
}

