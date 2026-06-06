import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { createBillShareToken } from "@/lib/bill-share-token";
import client from "@/lib/prismadb1";

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

const toAmountNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (typeof value === "object") {
    const maybeDecimal = value as { toNumber?: () => number; toString?: () => string };
    if (typeof maybeDecimal.toNumber === "function") {
      const n = maybeDecimal.toNumber();
      return Number.isFinite(n) ? n : 0;
    }
    if (typeof maybeDecimal.toString === "function") {
      const parsed = Number(maybeDecimal.toString().replace(/,/g, "").trim());
      return Number.isFinite(parsed) ? parsed : 0;
    }
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getPayableAmount = async (pelak: string): Promise<number> => {
  const latestCharge = await client.new_account.findFirst({
    where: {
      pelak,
    },
    orderBy: {
      id: "desc",
    },
    select: {
      TotalBill: true,
      paidBill: true,
    },
  });

  if (!latestCharge) return 0;

  const totalBill = toAmountNumber(latestCharge.TotalBill);
  const paidBill = toAmountNumber(latestCharge.paidBill);
  return Math.max(0, Math.round(totalBill - paidBill));
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
    const normalizedPelak = parsed.data.pelak.trim().toUpperCase();
    const payableAmount = await getPayableAmount(normalizedPelak);
    const formattedAmount = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(payableAmount);
    const cardNumber =
      process.env.BILL_PAYMENT_CARD_NUMBER?.trim() || "212165479875432";
    const contactPhone = process.env.BILL_CONTACT_PHONE?.trim() || "";

    const smsText =
      `مالك محترم يلاك ${normalizedPelak} باسلام لطفا هرجه سريعتر نسبت به يرداخت بدهى مالكانه خود به مبلغ ${formattedAmount} ريال اقدام نماييد. ` +
      `شماره كارت : ${cardNumber} مديريت مجتمع خلیج فارس تلفن : ${contactPhone} ` +
      `لينك ارسال فيش يرداخت ${url} لغو ١١`;

    return NextResponse.json(
      {
        url,
        token: shareToken,
        smsText,
        amount: formattedAmount,
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
