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

  const store = await client.store.delete({
    where: { pelak: id },
  });

  return NextResponse.json(store, {
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

  const store = await client.store.findUnique({
    where: { pelak: id },
    include: {
      
      types_bazar: {
        select: {
          id: true,
          bazar: true,
        },
      },
      types_tabagh: {
        select: {
          id: true,
          tabagh: true,
        },
      },
    },
  });
    const res = {
      ...store,
      nov: store?.nov?.toString(),
      tabagh: store?.tabagh?.toString(),
      rahro: store?.rahro?.toString(),
      bazar: store?.bazar?.toString(),
      ejareh: store?.ejareh?.toString(),

      chargeProfile:store?.chargeProfile?.toString(),
      pelakNU:store?.pelak.split('-')[0],
      pelakCH:store?.pelak.split('-')[1]

    };
  return NextResponse.json(res, {
    status: 200,
  });
}
