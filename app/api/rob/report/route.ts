import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";
import client from "@/lib/prismadb1";
//@ts-ignore
import moment from "moment-jalaali";

// Helper to convert Persian digits to Latin digits
const toLatinDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

// Calculate total charge based on startDate and rate (same logic as ChargeCalculation)
function calculateTotalCharge(startDate: string, rate: number): number {
  moment.loadPersian({ usePersianDigits: false });
  
  const latinDate = toLatinDigits(startDate.trim());
  const start = moment(latinDate, "jYYYY/jMM/jDD", true);
  const today = moment();

  if (!start.isValid()) {
    return 0;
  }

  const START_YEAR_3 = 3;
  const YEAR_1398 = 1398;
  const YEAR_1402 = 1402;

  let totalCharge = 0;
  const startYear = start.jYear();
  const endYear = today.jYear();

  for (let year = startYear; year <= endYear; year++) {
    const isFirstYear = year === startYear;
    const isLastYear = year === endYear;

    let monthsInYear = 12;
    if (isFirstYear) monthsInYear = 12 - start.jMonth();
    if (isLastYear) {
      monthsInYear = today.jMonth() + 1;
    }

    let yearlyCharge = 0;

    if (monthsInYear === 0) {
      yearlyCharge = 0;
    } else if (year >= YEAR_1402) {
      yearlyCharge = rate * monthsInYear * 100000;
    } else if (year >= YEAR_1398 && year <= 1401) {
      const monthsToUse = isLastYear ? monthsInYear : 12;
      yearlyCharge = rate * monthsToUse * 10000;
    } else if (year - startYear < START_YEAR_3) {
      yearlyCharge = rate * monthsInYear * 3000;
    } else {
      const monthsToUse = isLastYear ? monthsInYear : 12;
      yearlyCharge = rate * monthsToUse * 10000;
    }

    totalCharge += yearlyCharge;
  }

  return totalCharge;
}

export async function GET(request: NextRequest) {
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
    // Get all unique pelaks from sarghofli table
    const allRobRecords = await client.sarghofli.findMany({
      select: {
        pelak: true,
        price: true,
        discount: true,
        invitedate: true,
      },
    });

    // Group by pelak
    const pelakMap = new Map<string, {
      pelak: string;
      records: Array<{ price: number; discount: number | null; invitedate: string | null }>;
    }>();

    for (const record of allRobRecords) {
      const pelak = record.pelak;
      //@ts-ignore
      if (!pelakMap.has(pelak)) {
      //@ts-ignore

        pelakMap.set(pelak, {
          pelak,
          records: [],
        });
      }
      // Ensure price is converted to number (handle BigInt, string, or number)
      const price = typeof record.price === 'bigint' 
        ? Number(record.price) 
        : typeof record.price === 'string' 
      //@ts-ignore

        ? parseFloat(record.price.replace(/,/g, '')) || 0
        : Number(record.price) || 0;
      
      const discount = record.discount 
        ? (typeof record.discount === 'bigint' 
          ? Number(record.discount) 
          : typeof record.discount === 'string' 
      //@ts-ignore

          ? parseFloat(record.discount.replace(/,/g, '')) || 0
          : Number(record.discount) || 0)
        : null;
      //@ts-ignore
      
      pelakMap.get(pelak)!.records.push({
        price,
        discount,
        invitedate: record.invitedate || null,
      });
    }

    // Get all unique pelaks that have invitedate
    const pelaksWithInviteDate = Array.from(pelakMap.entries())
      .filter(([_, data]) => 
        data.records.some((r) => r.invitedate && r.invitedate.trim())
      )
      .map(([pelak]) => pelak.toUpperCase());

    if (pelaksWithInviteDate.length === 0) {
      return NextResponse.json([], {
        status: 200,
      });
    }

    // Fetch all stores at once to avoid N+1 queries
    const stores = await client.store.findMany({
      where: {
        pelak: {
          in: pelaksWithInviteDate,
        },
      },
      select: {
        pelak: true,
        metraj: true,
        name: true,
        // @ts-ignore - malekiyat field will be added to Prisma schema
        malekiyat: true,
      } as any,
    });

    // Create a map for quick lookup
    const storeMap = new Map(
      stores.map((store: any) => [store.pelak.toUpperCase(), store])
    );

    // Calculate values for each pelak
    const reportData = [];
      //@ts-ignore

    for (const [pelak, data] of pelakMap.entries()) {
      // Find first record with invitedate
      const firstWithInviteDate = data.records.find(
      //@ts-ignore

        (r) => r.invitedate && r.invitedate.trim()
      );

      if (!firstWithInviteDate) {
        // Skip pelaks without invitedate
        continue;
      }

      // Get store info from map
      const store = storeMap.get(pelak.toUpperCase());

      if (!store || !store.metraj) {
        // Skip pelaks without metraj
        continue;
      }

      // Skip pelaks with malekiyat (ownership) - they don't include rental fees
      // @ts-ignore - malekiyat field will be added to Prisma schema
      if (store.malekiyat === true) {
        continue;
      }

      const rate = Number(store.metraj) || 0;
      const startDate = firstWithInviteDate.invitedate!;

      // Calculate total charge
      const totalCharge = calculateTotalCharge(startDate, rate);

      // Calculate total paid amount (sum of all مبلغ/price values only)
      const totalPaidAmount = data.records.reduce(
        (sum: number, r: { price: number; discount: number | null; invitedate: string | null }) => {
          // Ensure we're adding numbers, not concatenating strings
          const price = Number(r.price) || 0;
          return sum + price;
        },
        0
      );

      // Calculate total discount (sum of all discount values)
      const totalDiscount = data.records.reduce(
        (sum: number, r: { price: number; discount: number | null; invitedate: string | null }) => {
          const discount = Number(r.discount) || 0;
          return sum + discount;
        },
        0
      );

      // Calculate remaining balance (جمع کل - مجموع پرداخت‌ها - مجموع تخفیف‌ها)
      const remainingBalance = totalCharge - totalPaidAmount - totalDiscount;

      reportData.push({
        pelak,
        name: store.name || "",
        totalCharge,
        totalPaidAmount,
        remainingBalance,
      });
    }

    // Sort by pelak
    reportData.sort((a, b) => a.pelak.localeCompare(b.pelak));

    // Ensure all numbers are properly serialized (handle BigInt if any)
    const serializedData = reportData.map(item => ({
      pelak: item.pelak,
      name: item.name,
      totalCharge: Number(item.totalCharge),
      totalPaidAmount: Number(item.totalPaidAmount),
      remainingBalance: Number(item.remainingBalance),
    }));

    return NextResponse.json(serializedData, {
      status: 200,
    });
  } catch (error: any) {
    await log({
      message: "Rob report failed. Error: " + error.message,
      type: "cron",
      mention: true,
    });

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      {
        status: 500,
      }
    );
  }
}

