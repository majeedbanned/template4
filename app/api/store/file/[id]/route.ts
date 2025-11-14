import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import client from "@/lib/prismadb1";
import { unlink } from "fs/promises";
import { join } from "path";
import { z } from "zod";

// Schema for updating document metadata
const UpdateDocSchema = z.object({
  CatID: z.number().optional(),
  name: z.string().optional(),
});

// GET - Retrieve a specific document
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
      include: {
        Doc_cat: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error retrieving document" },
      { status: 500 }
    );
  }
}

// PUT - Update document metadata
export async function PUT(
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
    const body = await req.json();
    
    const validation = UpdateDocSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.errors },
        { status: 400 }
      );
    }

    const response = await client.doc_files.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(
      {
        message: "Document updated successfully",
        data: response,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error updating document" },
      { status: 500 }
    );
  }
}

// DELETE - Delete document and file from disk
export async function DELETE(
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

    // Get document info first
    const document = await client.doc_files.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      const filePath = join(
        process.cwd(),
        "public",
        "uploads",
        "store",
        document.name || ""
      );
      await unlink(filePath);
    } catch (fileError) {
      console.error("Error deleting file from disk:", fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await client.doc_files.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error deleting document" },
      { status: 500 }
    );
  }
}

