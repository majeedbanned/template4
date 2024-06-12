import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";
import client from "@/lib/prismadb1";
import { z } from "zod";
import { Tenantschema } from "@/lib/schemas";

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
 // console.log("here");
  //** get headers **//

  // const svix_id = req.headers.get("svix-id") ?? '';
  // const svix_timestamp = req.headers.get("svix-timestamp") ?? '';
  // const svix_signature = req.headers.get("svix-signature") ?? '';

  const res: z.infer<typeof Tenantschema> = await req.json();

  //** pars request body */
  const validation = Tenantschema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    return NextResponse.json(errors, {
      status: 400,
    });
  }

  //** check for duplicate pelak */

  const newres = {
    ...res,
  };

  const { trow, ...newres1 } = newres;
  const response = await client.tenant.create({
    data: newres1,
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

  const res: z.infer<typeof Tenantschema> = await req.json();

  //** pars request body */
  const validation = Tenantschema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
  //  console.log(errors);
    return NextResponse.json(errors, {
      status: 400,
      statusText: "s1",
    });
  }

  const newres = {
    ...res,
    
  };
  const { trow, ...newres1 } = newres;

  const response = await client.tenant.update({
    where: {
      trow: res.trow,
    },
    data: newres1,
  });

  return NextResponse.json(response, {
    status: 200,
  });
}
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;
  const pelak1 = url.searchParams.get("pelak") || undefined;


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
    const response = await client.tenant.findMany({
      where: {
        ...(search && {
          OR: [
            { pelak: { contains: search } },
            { tfname: { contains: search } },
            { tlname: { contains: search } },
            { tmobile: { contains: search } },
          ],
        }),
        ...(pelak1!='all' && {pelak: pelak1}),

      },
      select:{
       cposti:true,
       datemojavez:true,
       disc:true,
       endate:true,
       pelak:true,
       sex:true,
       stdate:true,
       storePelak:true,
       taddress:true,
       tfather:true,
       tfname:true,
       tjob:true,
       tlname:true,
       tmeli:true,
       tmobile:true,trow:true,ttel:true,
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
        where: { moduleID: 2 },
      },
      },

      orderBy: {
        trow: "desc",
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
        moduleId: 2,
      },
    });

    const combinedResults = response.map(owner => {
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
   // console.log("errr");
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
