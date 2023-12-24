import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";

import client from "@/lib/prismadb1";
import { Prisma } from "@prisma/client";

import { z } from "zod";
import { StoreSchema } from "@/lib/schemas";

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

  const res: z.infer<typeof StoreSchema> = await req.json();

  //** pars request body */
  const validation = StoreSchema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    return NextResponse.json(errors, {
      status: 400,
    });
  }

  //** check for duplicate pelak */
  const { pelakCH, pelakNU } = res;

  const [pelakExist] = await Promise.all([
    client.store.findUnique({
      where: {
        pelak: pelakNU + "-" + pelakCH.toUpperCase(),
      },
      select: {
        pelak: true,
      },
    }),
  ]);

  if (pelakExist) {
    return NextResponse.json(
      { message: "pelak is allredy used" },
      {
        status: 422,
      }
    );
  }

  const newres = {
    ...res,
    pelak: res.pelakNU + "-" + res.pelakCH.toUpperCase(),
    nov: parseInt(res.nov),
    tabagh: parseInt(res.tabagh),
    rahro: parseInt(res.rahro),
    bazar: parseInt(res.bazar),
    chargeProfile: parseInt(res.chargeProfile),
    ejareh: parseInt(res.ejareh.toString().replace(/,/g, "")),
  };
  // @ts-ignore: Unreachable code error
  delete newres.pelakNU;
  // @ts-ignore: Unreachable code error
  delete newres.pelakCH;

  const response = await client.store.create({
    data: newres,
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

  const res: z.infer<typeof StoreSchema> = await req.json();

  //** pars request body */
  const validation = StoreSchema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    //   console.log(errors);
    return NextResponse.json(errors, {
      status: 400,
      statusText: "s1",
    });
  }

  const newres = {
    ...res,
    nov: parseInt(res.nov),
    tabagh: parseInt(res.tabagh),
    rahro: parseInt(res.rahro),
    bazar: parseInt(res.bazar),
    chargeProfile: parseInt(res.chargeProfile),
    ejareh: parseInt(res.ejareh.toString().replace(/,/g, "")),
  };
  // @ts-ignore: Unreachable code error
  delete newres.pelakNU;
  // @ts-ignore: Unreachable code error
  delete newres.pelakCH;

  const response = await client.store.update({
    where: {
      pelak: res.pelakNU + "-" + res.pelakCH,
    },
    data: newres,
  });

  return NextResponse.json(response, {
    status: 200,
  });
}
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;

  const active =
    url.searchParams.get("active")?.toString().split(",").toString() ||
    undefined;

  const fromdate =
    url.searchParams.get("fromdate")?.toString().split(",").toString() ||
    undefined;

  const todate =
    url.searchParams.get("todate")?.toString().split(",").toString() ||
    undefined;

  const sort =
    url.searchParams.get("sort")?.toString().split(",").toString() || undefined;

  const rahro =
    url.searchParams.get("rahro")?.toString().split(",").map(Number) ||
    undefined;
  const tabagh =
    url.searchParams.get("tabagh")?.toString().split(",").map(Number) ||
    undefined;
  const bazar =
    url.searchParams.get("bazar")?.toString().split(",").map(Number) ||
    undefined;

  const pardakht =
    url.searchParams.get("pardakht")?.toString().split(",").map(Number) ||
    undefined;

    const npardakht =
    url.searchParams.get("npardakht")?.toString().split(",").map(Number) ||
    undefined;

  const nov =
    url.searchParams.get("nov")?.toString().split(",").map(Number) || undefined;

  const profile =
    url.searchParams.get("profile")?.toString().split(",").map(Number) ||
    undefined;

  const debt =
    url.searchParams.get("debt")?.toString().split(",").map(Number) ||
    undefined;

  const date =
    url.searchParams.get("date")?.toString().split(",").map(String) ||
    undefined;
  // console.log(date)
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
    // const response = await client.store.findMany({
    //   where: {
    //     ...(search && {
    //       OR: [{ pelak: { contains: search } }, { name: { contains: search } }],
    //     }),

    //     ...(rahro && {
    //       rahro: { in: rahro },
    //     }),

    //     ...(active === "1" && {
    //       active: Boolean(1),
    //     }),
    //     ...(active === "0" && {
    //       active: Boolean(0),
    //     }),

    //     ...(nov && {
    //       nov: { in: nov },
    //     }),
    //     ...(tabagh && {
    //       tabagh: { in: tabagh },
    //     }),
    //     ...(bazar && {
    //       bazar: { in: bazar },
    //     }),
    //     ...(profile && {
    //       chargeProfile: { in: profile },
    //     }),
    //   },
    //   include: {
    //     // select:{   pelak: true,
    //     // name: true,
    //     // metraj: true,
    //     // ejareh: true,
    //     // tel1: true,
    //     // tel2: true,
    //     // active: true,
    //     // tovzeh: true},
    //     types_rahro: { select: { id: true, rahro: true } },
    //     types_bazar: { select: { id: true, bazar: true } },
    //     types_nov: { select: { nov: true } },
    //     types_tabagh: { select: { tabagh: true } },
    //     chargeDef: { select: { name: true, charge: true, type: true } },
    //     stores_discounts: {
    //       select: {
    //         id: true,
    //         discountID: true,
    //         discountDef: { select: { name: true, discountPersand: true } },
    //       },
    //     },
    //     new_account: {
    //       select: {
    //         month: true,
    //         pelak: true,
    //         monthbill: true,
    //         deptPeriod: true,
    //         paidBill: true,
    //         debt: true,
    //         penalty: true,
    //         paidExtraAsset: true,
    //         discount: true,
    //         TotalBill: true,
    //       },
    //       //{ month: date },
    //       where: {
    //         ...(pardakht?.includes(2) && {
    //           paidBill: 0  ,
    //         }),

    //         ...(date && {
    //           month: date,
    //         }),
    //       },
    //     },
    //   },

    //   // include:{
    //   //   new_account:{where:{paidBill:''}}
    //   // },
    //   orderBy: {
    //     pelak: "desc",
    //   },
    //   // include:{maghtatbl:true},
    //   take: 100,
    // });

    let fromdateq = "";
    if (fromdate) {
      if (todate)
        fromdateq = ` AND (dbo.new_account.paidDate >= '${fromdate}'  ) 
                      AND (dbo.new_account.paidDate <= '${todate}'  ) `;
      else fromdateq = ` AND (dbo.new_account.paidDate = '${fromdate}' ) `;
    }

    let novq = "";
    if (nov) {
      novq = ` AND (dbo.store.nov in (${nov}) ) `;
    }
    let rahroq = "";
    if (rahro) {
      rahroq = ` AND (dbo.store.rahro in (${rahro}) ) `;
    }
    let sortq = "";
    if (sort) {
      sortq = sort === "r" ? " newid()" : " dbo.store.pelak ";
    } else {
      sortq = " dbo.store.pelak ";
    }
    let bazarq = "";
    if (bazar) {
      bazarq = ` AND (dbo.store.bazar in (${bazar}) ) `;
    }
    let tabaghq = "";
    if (tabagh) {
      tabaghq = ` AND (dbo.store.tabagh in (${tabagh}) ) `;
    }
    let debtq = "";
    if (debt) {
      if (debt?.includes(1)) {
        debtq = ` AND (dbo.new_account.deptPeriod>0 and dbo.new_account.deptPeriod<=5 ) `;
      }
      if (debt?.includes(2)) {
        debtq = ` AND (dbo.new_account.deptPeriod>=6  ) `;
      }

      if (debt?.includes(3)) {
        debtq = ` AND (dbo.new_account.deptPeriod>=2 and dbo.new_account.deptPeriod<=5 ) `;
      }
    }

    const wrappedStrings = date?.map((str) => `'${str}'`);

    let dateq = "";
    if (date) {
      dateq = ` AND (dbo.new_account.month in (${wrappedStrings}) ) `;
    } else {
      dateq = ` AND (dbo.new_account.month ='1402-05' ) `;
    }
    let activeq = "";
    if (active) {
      activeq = ` AND (dbo.store.active in (${active}) ) `;
    }


    let npardakhtq = "";
    if (npardakht) {

      if (npardakht?.includes(1)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'پوز' ) or`
      }
      if (npardakht?.includes(2)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'پرداخت آنلاین' ) or`
      }
      if (npardakht?.includes(3)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'واریز به حساب' ) or`
      }
      if (npardakht?.includes(4)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'پوز اطلاعات' ) or`
      }
      npardakhtq = ` AND ( ${npardakhtq.substring(0, npardakhtq.length - 2)} ) `;
    }


    let pardakhtq = "";
    if (pardakht?.includes(1)) {
      pardakhtq = ` AND (dbo.new_account.paidBill= dbo.new_account.TotalBill 
                         or dbo.new_account.TotalBill=0) `;
    }

    let pardakhtqB = "";
    if (pardakht?.includes(2)) {
      pardakhtqB = ` AND (dbo.new_account.paidBill<dbo.new_account.TotalBill 
                         ) `;
    }

    let searchq = "";
    if (search) {
      searchq = ` AND (dbo.store.pelak like '%${search}%' or dbo.store.name like '%${search}%' ) `;
    }

    // const serializedIds = JSON.stringify(ids);
    const response = await client.$queryRawUnsafe(`
   SELECT     dbo.store.name, dbo.store.pelak, dbo.types_bazar.bazar, dbo.types_tabagh.tabagh, dbo.types_nov.nov, dbo.types_rahro.rahro, dbo.new_account.month, dbo.store.active, dbo.new_account.deptPeriod, 
                         dbo.new_account.TotalBill, dbo.new_account.paidBill,dbo.new_account.discription
FROM            dbo.new_account INNER JOIN
                         dbo.store ON dbo.new_account.pelak = dbo.store.pelak INNER JOIN
                         dbo.types_bazar ON dbo.store.bazar = dbo.types_bazar.id INNER JOIN
                         dbo.types_nov ON dbo.store.nov = dbo.types_nov.id INNER JOIN
                         dbo.types_rahro ON dbo.store.rahro = dbo.types_rahro.id INNER JOIN
                         dbo.types_tabagh ON dbo.store.tabagh = dbo.types_tabagh.id
                         where 1=1 ${novq} ${rahroq} ${bazarq} ${tabaghq} ${dateq}
                         ${activeq} ${searchq} ${pardakhtq} ${pardakhtqB} ${debtq} ${fromdateq} order by ${sortq}`);

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
