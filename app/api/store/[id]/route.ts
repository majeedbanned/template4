import client from "@/lib/prismadb1";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  //**  Auth **//
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json(
  //     {
  //       message: "Unauthorized: Login required.",
  //     },
  //     {
  //       status: 401,
  //     }
  //   );
  // }
  const id = params.id;

  const store = await client.store.findUnique({
    where: { pelak: id },
    // select: { url: true, password: true },
  });
    const res = {
      ...store,
      // pelak:store.pelakNU + "-" + res.pelakCH,
      nov: store?.nov?.toString(),
      tabagh: store?.tabagh?.toString(),
      rahro: store?.rahro?.toString(),
      bazar: store?.bazar?.toString(),
      pelakNU:store?.pelak.split('-')[0],
      pelakCH:store?.pelak.split('-')[1]

    };
  return NextResponse.json(res, {
    status: 200,
  });
}
