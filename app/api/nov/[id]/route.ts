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

  const per = await client.types_nov.deleteMany({
    where: { id: Number(id) },
  });


 

  return NextResponse.json(per, {
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
  const users = await client.types_nov.findUnique({
    where: { id: Number(id) },
  });
 

  const res = {
    ...users,
  
  };
  return NextResponse.json(res, {
    status: 200,
  });

}
