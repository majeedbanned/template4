import { NextApiRequest, NextApiResponse } from "next";
import { Session, withUserAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";

import { PrismaClient } from "@prisma-second-db";
import client from "@/lib/prismadb1";
import { bigint, number } from "zod";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;
  const rahro = url.searchParams.get("rahro")?.toString().split(',').map(Number) || undefined;
  const tabagh = url.searchParams.get("tabagh")?.toString().split(',').map(Number) || undefined;
  const bazar = url.searchParams.get("bazar")?.toString().split(',').map(Number) || undefined;
  const nov = url.searchParams.get("nov")?.toString().split(',').map(Number) || undefined;
  console.log(nov);
  console.log(request.url);

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
  //  types_bazar: { id: Number(bazar) },
  try {
    const response = await client.store.findMany({
      where: {
        ...(search && {
          OR: [{ pelak: { contains: search } }, { name: { contains: search } }],
        }),
        ...(rahro && {
          rahro:  { in: rahro} ,
        }),
        ...(nov && {
          nov:  { in: nov} ,
        }),
        ...(tabagh && {
          tabagh:  { in: tabagh} ,
        }),
        ...(bazar && {
          bazar:  { in: bazar} ,
        }),
      },
      select: {
        pelak: true,
        name: true,
        metraj: true,
        tel1: true,
        tel2: true,
        tovzeh: true,
        types_rahro: { select: { id: true, rahro: true } },
        types_bazar: { select: { id: true, bazar: true } },
        types_nov: { select: { nov: true } },
        types_tabagh: { select: { tabagh: true } },
      },
      orderBy: {
        pelak: "desc",
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
    console.log("errr");
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
