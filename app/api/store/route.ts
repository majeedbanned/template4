import { NextApiRequest, NextApiResponse } from "next";
import { Session, withUserAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";



import { PrismaClient } from '@prisma-second-db'
import client from "@/lib/prismadb1";



export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;
  console.log(search);
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
 // const prisma = new PrismaClient()
  try {
    const response = await client.store.findMany({
       where: {
      
      
        ...(search != "null"
          ? {
              OR: [
                { pelak: { contains: search } },
                { name: { contains: search } },
              ],
            }
          : {}),
        
      },
      select: {
        pelak: true,
        name: true,
        metraj: true,
        tel1: true,
        tel2: true,
        tovzeh: true,
        // maghta: true,
        // domdom: true,
        // maghtatbl: {
        //   select: {
        //     name: true,
        //   },
        // },
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

