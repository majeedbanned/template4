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
 // //console.log("here");
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
  //  //console.log(errors);
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
  let search = url.searchParams.get("search") || undefined;
  let fromdate = url.searchParams.get("fromdate") || undefined;
  let todate = url.searchParams.get("todate") || undefined;

  if (search)
  search=decodeURIComponent(String(search))
  //console.log(search)
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
  const tabloFilter = url.searchParams.get("tabloFilter") || undefined;
  const cpostiFilter = url.searchParams.get("cpostiFilter") || undefined;
  const sexFilter = url.searchParams.get("sexFilter") || undefined;
  const stdateFrom = url.searchParams.get("stdateFrom") || undefined;
  const stdateTo = url.searchParams.get("stdateTo") || undefined;
  const endateFrom = url.searchParams.get("endateFrom") || undefined;
  const endateTo = url.searchParams.get("endateTo") || undefined;
  const datemojavezFrom = url.searchParams.get("datemojavezFrom") || undefined;
  const datemojavezTo = url.searchParams.get("datemojavezTo") || undefined;
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

  //console.log(fromdate?.toPersianDigits())
  //console.log(todate)

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
        { datemojavez: { contains: search } },
        { endate: { contains: search } },
        { stdate: { contains: search } },
        { tablo: { contains: search } },
        { tjob: { contains: search } },
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
    if (tabloFilter) whereClause.tablo = { contains: tabloFilter };
    if (cpostiFilter) whereClause.cposti = { contains: cpostiFilter };
    if (sexFilter) whereClause.sex = { contains: sexFilter };

    // Date range filters
    if (stdateFrom || stdateTo) {
      whereClause.stdate = {};
      if (stdateFrom) whereClause.stdate.gte = stdateFrom;
      if (stdateTo) whereClause.stdate.lte = stdateTo;
    }

    if (endateFrom || endateTo) {
      whereClause.endate = {};
      if (endateFrom) whereClause.endate.gte = endateFrom;
      if (endateTo) whereClause.endate.lte = endateTo;
    } else if (fromdate && todate) {
      whereClause.endate = {
        gte: fromdate?.toPersianDigits(),
        lte: todate?.toPersianDigits(),
      };
    }

    if (datemojavezFrom || datemojavezTo) {
      whereClause.datemojavez = {};
      if (datemojavezFrom) whereClause.datemojavez.gte = datemojavezFrom;
      if (datemojavezTo) whereClause.datemojavez.lte = datemojavezTo;
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

    const response = await client.tenant.findMany({
      where: whereClause,
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
       tablo:true,
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
        stdate: "desc",
      },
      // include:{maghtatbl:true},
      take: 100,
    });


     //console.log(response.length)

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
