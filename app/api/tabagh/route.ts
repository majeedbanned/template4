import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";
import client from "@/lib/prismadb1";
import { z } from "zod";
import { Tabaghschema, Userschema } from "@/lib/schemas";

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

  const res: z.infer<typeof Tabaghschema> = await req.json();

  //** pars request body */
  const validation = Tabaghschema.safeParse(res);
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

  const duplicate = await client.types_tabagh.findFirst({
    where: { tabagh: newres.tabagh },
  });

  if(duplicate)
  {
    return NextResponse.json(
      { message: "rahro is allredy exist" },
      {
        status: 422,
      }
    );
  }

  const { id,  ...newres1 } = newres;
  const response = await client.types_tabagh.create({
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

  const res: z.infer<typeof Tabaghschema> = await req.json();

  //** pars request body */
  const validation = Tabaghschema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    console.log(errors);
    return NextResponse.json(errors, {
      status: 400,
      statusText: "s1",
    });
  }

  const newres = {
    ...res,
   
  };
  const { id, ...newres1 } = newres;
  
  const response = await client.types_tabagh.update({
    where: {
      id: Number(res.id),
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
    const response = await client.types_tabagh.findMany({
      // where: {
      //   ...(search && {
      //     OR: [
      //       { pelak: { contains: search } },
      //       { tfname: { contains: search } },
      //       { tlname: { contains: search } },
      //       { tmobile: { contains: search } },
      //     ],
      //   }),
      //   ...(pelak1 && {pelak: pelak1}),

      // },

      orderBy: {
        id: "desc",
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
