import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { createBillShareToken } from "@/lib/bill-share-token";

const requestSchema = z.object({
  pelak: z.string().min(1),
  lang: z.string().min(2).max(10).optional(),
});

const getRequestOrigin = (request: NextRequest): string => {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");

  const protocol = forwardedProto || "http";
  const hostname = forwardedHost?.split(",")[0].trim() || host || "localhost";

  return `${protocol}://${hostname}`;
};

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: Login required." },
      { status: 401 },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0]?.message || "Invalid request body" },
        { status: 400 },
      );
    }

    const shareToken = createBillShareToken(parsed.data.pelak);
    const origin = getRequestOrigin(request);
    const lang = (parsed.data.lang || "fa").trim();
    const url = `${origin}/${lang}/admin/bill?share=${encodeURIComponent(shareToken)}`;

    return NextResponse.json(
      {
        url,
        token: shareToken,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to generate share link" },
      { status: 500 },
    );
  }
}
