import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";
import client from "@/lib/prismadb1";
import { z } from "zod";
import { Chargechema } from "@/lib/schemas";
import jalaliMoment from "jalali-moment";
export async function POST(req: NextRequest) {
  // **  Auth **//
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

  //** get headers **//

  // const svix_id = req.headers.get("svix-id") ?? '';
  // const svix_timestamp = req.headers.get("svix-timestamp") ?? '';
  // const svix_signature = req.headers.get("svix-signature") ?? '';

  const res: z.infer<typeof Chargechema> = await req.json();

  //** pars request body */
  const validation = Chargechema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    return NextResponse.json(errors, {
      status: 400,
    });
  }

  //** check for duplicate pelak */

  const newres = {
    ...res,
    pelak: res.pelak.toString().toUpperCase(),
    paidDate: res.paidDate.toEnglishDigits(),
    //@ts-ignore
    deptPeriod: parseInt(res.deptPeriod),
    paidBill: res.paidBill.toString().replace(/\D/g, ""),
    discount: parseInt(res.discount.replace(/,/g, "")),
    debt: parseInt(res.debt.toString().replace(/,/g, "")),
    monthbill: parseInt(res.monthbill.toString().replace(/,/g, "")),
    paidExtra: parseInt(res.paidExtra.toString().replace(/,/g, "")),
    paidExtraAsset: parseInt(res.paidExtraAsset.toString().replace(/,/g, "")),

    created_at: jalaliMoment().format("jYYYY/jMM/jDD HH:MM"),
    created_user: session.user.id,
    updated_at: "",
    updated_user: 0,
  };
  const { TotalBill, id, ...newObject } = newres;


  const response = await client.new_account.create({
    data: newObject,
  });

  return NextResponse.json(response, {
    status: 200,
  });
}
export async function PUT(req: NextRequest) {
  //  **  Auth **//
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

  const res: z.infer<typeof Chargechema> = await req.json();

  //** pars request body */
  const validation = Chargechema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    console.log(errors);
    return NextResponse.json(errors, {
      status: 400,
      statusText: "s1",
    });
  }

  const newres = {
    ...res,
    pelak: res.pelak.toString().toUpperCase(),
    paidBill: res.paidBill.toString().replace(/\D/g, ""),
    paidDate: res.paidDate.toEnglishDigits(),
    //@ts-ignore
    deptPeriod: parseInt(res.deptPeriod),
    updated_at: jalaliMoment().format("jYYYY/jMM/jDD hh:mm"),
    updated_user: session.user.id,
    discount: parseInt(res.discount.replace(/,/g, "")),
    debt: parseInt(res.debt.toString().replace(/,/g, "")),
    monthbill: parseInt(res.monthbill.toString().replace(/,/g, "")),
    paidExtra: parseInt(res.paidExtra.toString().replace(/,/g, "")),
    paidExtraAsset: parseInt(res.paidExtraAsset.toString().replace(/,/g, "")),

  };
  
  const { TotalBill, id, ...newObject } = newres;
  const response = await client.new_account.update({
    where: {
      id: Number(res.id),
    },
    data: newObject,
  });

  return NextResponse.json(response, {
    status: 200,
  });
}
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pelak = url.searchParams.get("pelak") || undefined;
console.log(pelak)
  
  try {
    const response = await client.new_account.findMany({
      where: {
        ...(pelak && {
          OR: [{ pelak: pelak }, { month: { contains: pelak } }],
        }),
      },
      select: {
        id: true,
        pelak: true,
        month: true,
        monthbill: true,
        deptPeriod: true,
        penalty: true,
        debt: true,
        deadline: true,
        isueeDate: true,
        discount: true,
        discountDiscription: true,
        discription: true,
        TotalBill: true,
        paidBill: true,
        paidDate: true,
        paidExtra: true,
        paidTime: true,
        paidType: true,
        paidExtraAsset: true,
      },
      orderBy: {
        id: "desc",
      },
      // include:{maghtatbl:true},
      take: 100,
    });
    const res = JSON.parse(
      JSON.stringify(
        response,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    );
    return NextResponse.json(res, {
      status: 200,
    });
  } catch (error: any) {
    console.log(error.message);
    await log({
      message: "Usage cron failed. Error: " + error.message,
      type: "cron",
      mention: true,
    });

    if (error.code === "P2002") {
      //duplicate
      return NextResponse.json(
        { message: "duplicate entry" },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(error, {
      status: 400,
    });
  }
}
