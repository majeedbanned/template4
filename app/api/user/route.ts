import { NextApiRequest, NextApiResponse } from "next";
import { Session, withUserAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;
  ////console.log(search);
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
    const response = await prisma.users_mahd.findMany({
      where: {
        id: { gt: 1 },
        mahd_name: { not: null },
        ...(search != "null"
          ? {
              OR: [
                { mahd_name: { contains: search } },
                { domdom: { contains: search } },
              ],
            }
          : {}),
        // OR: [
        //   {  },
        //   { ...(search != "null" ? { domdom: { contains: search } } : {}) },
        // ],
      },
      select: {
        id: true,
        mahd_name: true,
        username: true,
        pass: true,
        rooztavalod: true,
        school_code: true,
        maghta: true,
        domdom: true,
        maghtatbl: {
          select: {
            name: true,
          },
        },
      },
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
   // //console.log("errr");
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

// export default withUserAuth(
//   async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
//     // GET /api/projects – get all users associated with the authenticated user

//     if (req.method === "GET") {
//       const response = await prisma.vclassSch.findMany({
//         where: {
//             id: {gt:2030}
//           },
//           select: {
//             id: true,
//             schoolcode: true,
//             schoolname: true,
//             teachername:true,
//             classcountv:true

//           },
//       });
//       return res.status(200).json(response);

//       // POST /api/user –
//     } else if (req.method === "POST") {
//       const { name, slug, domain } = req.body;
//       if (!name || !slug || !domain) {
//         return res
//           .status(422)
//           .json({ error: "Missing name or slug or domain" });
//       }
//       let slugError: string | null = null;

//       // check if slug is too long
//       if (slug.length > 48) {
//         slugError = "Slug must be less than 48 characters";

//         // check if slug is valid
//       }

//       const [slugExist, domainExist] = await Promise.all([
//         prisma.user.findUnique({
//           where: {
//             id:session.user.id,
//           },
//           select: {
//             email: true,
//           },
//         }),
//         prisma.user.findUnique({
//             where: {
//               id:session.user.id,
//             },
//             select: {
//               email: true,
//             },
//           }),
//       ]);
//       if (slugExist || domainExist) {
//         return res.status(422).json({
//           slugError: slugExist ? "Slug is already in use." : null,
//           domainError: domainExist ? "Domain is already in use." : null,
//         });
//       }
//     //   const response = await Promise.allSettled([
//     //     prisma.user.create({
//     //       data: {
//     //         name,
//     //         slug,
//     //         users: {
//     //           create: {
//     //             userId: session.user.id,
//     //             role: "owner",
//     //           },
//     //         },
//     //         domains: {
//     //           create: {
//     //             slug: domain,
//     //             primary: true,
//     //           },
//     //         },
//     //         billingCycleStart: new Date().getDate(),
//     //       },
//     //     }),
//     //     addDomainToVercel(domain),
//     //   ]);

//       return res.status(200);//.json(response);
//     } else {
//       res.setHeader("Allow", ["GET", "POST"]);
//       return res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
//   },
// );
