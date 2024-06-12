import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";

import client from "@/lib/prismadb1";
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
  const rahro =
    url.searchParams.get("rahro")?.toString().split(",").map(Number) ||
    undefined;
  const tabagh =
    url.searchParams.get("tabagh")?.toString().split(",").map(Number) ||
    undefined;
  const bazar =
    url.searchParams.get("bazar")?.toString().split(",").map(Number) ||
    undefined;
  const nov =
    url.searchParams.get("nov")?.toString().split(",").map(Number) || undefined;

  const profile =
    url.searchParams.get("profile")?.toString().split(",").map(Number) ||
    undefined;

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
    const response = await client.store.findMany({
      where: {
        ...(search && {
          OR: [{ pelak: { contains: search } }, { name: { contains: search } }],
        }),
        ...(rahro && {
          rahro: { in: rahro },
        }),
        ...(nov && {
          nov: { in: nov },
        }),
        ...(tabagh && {
          tabagh: { in: tabagh },
        }),
        ...(bazar && {
          bazar: { in: bazar },
        }),
        ...(profile && {
          chargeProfile: { in: profile },
        }),
      },
      select: {
        pelak: true,
        name: true,
        metraj: true,
        ejareh: true,
        tel1: true,
        active:true,
        changedate:true,
        aghsat:true,
        tajmi:true,
        tel2: true,
        tovzeh: true,
        types_rahro: { select: { id: true, rahro: true } },
        types_bazar: { select: { id: true, bazar: true } },
        types_nov: { select: { nov: true } },
        types_tabagh: { select: { tabagh: true } },
        chargeDef: { select: { name: true,charge:true,type:true } },
        stores_discounts: {
          select: {
            id: true,
            discountID: true,
            discountDef: { select: { name: true, discountPersand: true } },
          },
        },
        Doc_files: {
          select: {
            id: true,
            moduleID: true,
            CatID: true,
            name: true,
            date_: true,
            userID: true,
            pelak: true,
            rowId: true,
            Doc_cat: { select: { title: true } },
          },
          where: { moduleID: 4},
        },  
      },
      orderBy: {
        pelak: "desc",
      },
      // include:{maghtatbl:true},
      take: 100,
    });

    const docList = await client.doc_cat.findMany({
      select: {
        id: true,
        title: true,
        moduleId: true,
      },
      where: {
        moduleId: 4,
      },
    });

   // console.log(docList)
    const combinedResults = response.map(owner => {
      //const ownerDocList = docList.filter(doc => doc.id === owner.trow);
      return { ...owner, list: docList };
    });


    const res = JSON.parse(
      JSON.stringify(
        combinedResults,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    );
    return NextResponse.json(res, {
      status: 200,
    });
  } catch (error: any) {
  //  console.log("errr");
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
