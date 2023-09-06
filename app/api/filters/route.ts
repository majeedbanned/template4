import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";
import client from "@/lib/prismadb1";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") || undefined;

  //console.log(url);
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
  let newobj;
  let response;
  try {
    if (filter)
      if (filter === "rahro") {
        response = await client.types_rahro.findMany({
          select: {
            id: true,
            rahro: true,
          },
          orderBy: {
            id: "asc",
          },
        });

        newobj = response.map((obj) => ({
          value: obj.id.toString(),
          label: obj.rahro?.trim(),
        }));
      } else if (filter === "bazar") {
        response = await client.types_bazar.findMany({
          select: {
            id: true,
            bazar: true,
          },
          orderBy: {
            id: "asc",
          },
        });

        newobj = response.map((obj) => ({
          value: obj.id.toString(),
          label: obj.bazar?.trim(),
        }));
      } else if (filter === "tabagh") {
        response = await client.types_tabagh.findMany({
          select: {
            id: true,
            tabagh: true,
          },
          orderBy: {
            id: "asc",
          },
        });

        newobj = response.map((obj) => ({
          value: obj.id.toString(),
          label: obj.tabagh?.trim(),
        }));
      } else if (filter === "nov") {
        response = await client.types_nov.findMany({
          select: {
            id: true,
            nov: true,
          },
          orderBy: {
            id: "asc",
          },
        });

        newobj = response.map((obj) => ({
          value: obj.id.toString(),
          label: obj.nov?.trim(),
        }));
      }

      else if (filter === "profile") {
        response = await client.chargeDef.findMany({
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            id: "asc",
          },
        });

        newobj = response.map((obj) => ({
          value: obj.id.toString(),
          label: obj.name?.trim(),
        }));
      }


    const res = JSON.parse(
      JSON.stringify(
        newobj,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    );

  //  console.log(res);
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
