import client from "@/lib/prismadb1";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const id = params.id;
  const sarghofli = await client.sarghofli.delete({
    where: { id:Number( id) },
  });

  return NextResponse.json(sarghofli, {
    status: 200,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const id = params.id;
  const sarghofli = await client.sarghofli.findUnique({
    where: { id: Number(id) },
  });
    const res = {
      ...sarghofli,
    };
  return NextResponse.json(res, {
    status: 200,
  });
}
