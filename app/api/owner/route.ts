import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";
import client from "@/lib/prismadb1";
import { z } from "zod";
import { Ownerschema } from "@/lib/schemas";

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
  ////console.log("here");
  //** get headers **//

  // const svix_id = req.headers.get("svix-id") ?? '';
  // const svix_timestamp = req.headers.get("svix-timestamp") ?? '';
  // const svix_signature = req.headers.get("svix-signature") ?? '';

  const res: z.infer<typeof Ownerschema> = await req.json();

  //** pars request body */
  const validation = Ownerschema.safeParse(res);
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
  const response = await client.owner.create({
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

  const res: z.infer<typeof Ownerschema> = await req.json();

  //** pars request body */
  const validation = Ownerschema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    ////console.log(errors);
    return NextResponse.json(errors, {
      status: 400,
      statusText: "s1",
    });
  }

  const newres = {
    ...res,
  };
  const { trow, ...newres1 } = newres;

  const response = await client.owner.update({
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
  let search = url.searchParams.get("search") || undefined;
  if (search)
    search=decodeURIComponent(String(search))
  const pelak1 = url.searchParams.get("pelak") || undefined;

  // Advanced search filters
  const pelakFilter = url.searchParams.get("pelakFilter") || undefined;
  const tfnameFilter = url.searchParams.get("tfnameFilter") || undefined;
  const tlnameFilter = url.searchParams.get("tlnameFilter") || undefined;
  const tmobileFilter = url.searchParams.get("tmobileFilter") || undefined;
  const tmeliFilter = url.searchParams.get("tmeliFilter") || undefined;
  const tjobFilter = url.searchParams.get("tjobFilter") || undefined;
  const taddressFilter = url.searchParams.get("taddressFilter") || undefined;
  const tfatherFilter = url.searchParams.get("tfatherFilter") || undefined;
  const ttelFilter = url.searchParams.get("ttelFilter") || undefined;
  const cpostiFilter = url.searchParams.get("cpostiFilter") || undefined;
  const sexFilter = url.searchParams.get("sexFilter") || undefined;
  const storePelakFilter = url.searchParams.get("storePelakFilter") || undefined;
  const changeOwnerFilter = url.searchParams.get("changeOwnerFilter") || undefined;
  const changeOwnerFrom = url.searchParams.get("changeOwnerFrom") || undefined;
  const changeOwnerTo = url.searchParams.get("changeOwnerTo") || undefined;
  const created_atFrom = url.searchParams.get("created_atFrom") || undefined;
  const created_atTo = url.searchParams.get("created_atTo") || undefined;
  const updated_atFrom = url.searchParams.get("updated_atFrom") || undefined;
  const updated_atTo = url.searchParams.get("updated_atTo") || undefined;

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
    // Build where clause dynamically
    const whereClause: any = {};

    // Basic search (OR condition)
    if (search) {
      whereClause.OR = [
        { pelak: { contains: search } },
        { tfname: { contains: search } },
        { tlname: { contains: search } },
        { tmobile: { contains: search } },
        { tmeli: { contains: search } },
        { changeOwner: { contains: search } },
      ];
    }

    // Advanced filters (AND conditions)
    if (pelak1 && pelak1 !== 'all') {
      whereClause.pelak = pelak1;
    } else if (pelakFilter) {
      whereClause.pelak = { contains: pelakFilter };
    }
    if (tfnameFilter) whereClause.tfname = { contains: tfnameFilter };
    if (tlnameFilter) whereClause.tlname = { contains: tlnameFilter };
    if (tmobileFilter) whereClause.tmobile = { contains: tmobileFilter };
    if (tmeliFilter) whereClause.tmeli = { contains: tmeliFilter };
    if (tjobFilter) whereClause.tjob = { contains: tjobFilter };
    if (taddressFilter) whereClause.taddress = { contains: taddressFilter };
    if (tfatherFilter) whereClause.tfather = { contains: tfatherFilter };
    if (ttelFilter) whereClause.ttel = { contains: ttelFilter };
    if (cpostiFilter) whereClause.cposti = { contains: cpostiFilter };
    if (sexFilter) whereClause.sex = { contains: sexFilter };
    if (storePelakFilter) whereClause.storePelak = { contains: storePelakFilter };
    
    // Date range filters for changeOwner (takes precedence over text filter)
    if (changeOwnerFrom || changeOwnerTo) {
      whereClause.changeOwner = {};
      if (changeOwnerFrom) whereClause.changeOwner.gte = changeOwnerFrom;
      if (changeOwnerTo) whereClause.changeOwner.lte = changeOwnerTo;
    } else if (changeOwnerFilter) {
      whereClause.changeOwner = { contains: changeOwnerFilter };
    }

    if (created_atFrom || created_atTo) {
      whereClause.created_at = {};
      if (created_atFrom) whereClause.created_at.gte = created_atFrom;
      if (created_atTo) whereClause.created_at.lte = created_atTo;
    }

    if (updated_atFrom || updated_atTo) {
      whereClause.updated_at = {};
      if (updated_atFrom) whereClause.updated_at.gte = updated_atFrom;
      if (updated_atTo) whereClause.updated_at.lte = updated_atTo;
    }

    const response = await client.owner.findMany({
      where: whereClause,
      select: {
        trow: true,
        pelak: true,
        tfname: true,
        tlname: true,
        tfather: true,
        tjob: true,
        tmobile: true,
        ttel: true,
        taddress: true,
        tmeli: true,
        sex: true,
        cposti: true,
        storePelak: true,
        changeOwner: true,
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
          where: { moduleID: 1 },
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
        moduleId: 1,
      },
    });

   // //console.log(docList)
    const combinedResults = response.map(owner => {
      //const ownerDocList = docList.filter(doc => doc.id === owner.trow);
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
    //  //console.log("errr");
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
