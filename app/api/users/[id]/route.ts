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

  const per = await client.permission.deleteMany({
    where: { userID: Number(id) },
  });


  const users = await client.users.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json(users, {
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
  const users = await client.users.findUnique({
    where: { id: Number(id) },
  });
  const per = await client.permission.findMany({
    where: { userID: Number(id) },
  });

  const access: any[] = [];
  async function addObjectsAsync() {
    for (const item of per) {
      const system = await client.systems.findFirst({
        where: { id: item.systemID ?? -1 },
      });

      const accessRow = {
        systems: system?.name,
        locations: [
          item.add? "افزودن":'',
          item.edit?  "ویرایش":'',
          item.print?  "حذف":'',
          item.view ? "نمایش":'',
        ],
      };
      access.push(accessRow);
    }
  }
  await addObjectsAsync();
  const res = {
    ...users,
    access,
  };
  return NextResponse.json(res, {
    status: 200,
  });

}
