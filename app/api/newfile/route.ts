import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";
import client from "@/lib/prismadb1";
import { z } from "zod";
import { Docschema, Ownerschema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
    console.log('first')
  // **  Auth **//
  //const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json(
//       {
//         message: "Unauthorized: Login required.",
//       },
//       {
//         status: 401,
//       }
//     );
//   }


  const res: z.infer<typeof Docschema> = await req.json();

  //** pars request body */
  const validation = Docschema.safeParse(res);
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

  const { mode, ...newres1 } = newres;
  
  const response = await client.doc_files.create({
    data: newres1,
  });

  return NextResponse.json(response, {
    status: 200,
  });
}
