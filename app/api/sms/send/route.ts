import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { smsApi } from "@/lib/sms-api";
import { logger } from "@/lib/logger";

const sendSmsSchema = z.object({
  phone: z.string().min(5, "شماره تلفن نامعتبر است"),
  text: z.string().min(1, "متن پیامک الزامی است").max(1000),
  schoolCode: z.string().trim().min(1).optional(),
});

const toEnglishDigits = (value: string): string =>
  value
    .replace(/۰/g, "0")
    .replace(/۱/g, "1")
    .replace(/۲/g, "2")
    .replace(/۳/g, "3")
    .replace(/۴/g, "4")
    .replace(/۵/g, "5")
    .replace(/۶/g, "6")
    .replace(/۷/g, "7")
    .replace(/۸/g, "8")
    .replace(/۹/g, "9");

const normalizePhone = (phone: string): string =>
  toEnglishDigits(phone).replace(/[^\d]/g, "");

const getRequestDomain = (request: NextRequest): string => {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");

  if (forwardedHost) {
    return forwardedHost.split(",")[0].trim();
  }

  if (host) {
    return host;
  }

  return new URL(request.url).host;
};

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized: Login required.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = sendSmsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.errors[0]?.message || "Invalid request body",
        },
        { status: 400 },
      );
    }

    const phone = normalizePhone(parsed.data.phone);
    if (!phone) {
      return NextResponse.json(
        {
          message: "شماره تلفن نامعتبر است",
        },
        { status: 400 },
      );
    }

    const domain = getRequestDomain(request);
    const result = await smsApi.sendSMSAutoFrom(
      domain,
      [phone],
      parsed.data.text.trim(),
      parsed.data.schoolCode,
    );

    return NextResponse.json(
      {
        message: "پیامک با موفقیت ارسال شد",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("SMS send route failed:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "ارسال پیامک با خطا مواجه شد",
      },
      { status: 500 },
    );
  }
}
