import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import jalaliMoment from "jalali-moment";
import { log } from "@/lib/utils";
import client from "@/lib/prismadb1"; 
import { z } from "zod";
import { Robschema } from "@/lib/schemas";

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

  const res: z.infer<typeof Robschema> = await req.json();

  //** pars request body */
  const validation = Robschema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    return NextResponse.json(errors, {
      status: 400,
    });
  }

  //** check for duplicate pelak */

  const newres: any = {
    ...res,
    created_at: jalaliMoment().format("jYYYY/jMM/jDD HH:MM"),
    created_user: session.user.id,
    updated_at: "",
    updated_user: 1,
    price: parseInt(res.price.replace(/,/g, "")),
  };

  if (res.discount !== undefined && res.discount !== null && res.discount !== "") {
    newres.discount = parseInt(res.discount.toString().replace(/,/g, ""));
  }

  const { id, ...newres1 } = newres;
  const response = await client.sarghofli.create({
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

  const res: z.infer<typeof Robschema> = await req.json();

  //** pars request body */
  const validation = Robschema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
  //  //console.log(errors);
    return NextResponse.json(errors, {
      status: 400,
      statusText: "s1",
    });
  }

  const newres: any = {
    ...res,
    updated_at: jalaliMoment().format("jYYYY/jMM/jDD hh:mm"),
    updated_user: session.user.id,
    price: parseInt(res.price.replace(/,/g, "")),
  };

  if (res.discount !== undefined && res.discount !== null && res.discount !== "") {
    newres.discount = parseInt(res.discount.toString().replace(/,/g, ""));
  }

  const { id, ...newres1 } = newres;

  const response = await client.sarghofli.update({
    where: {
      id: res.id,
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

  // Advanced search filters
  const pelakFilter = url.searchParams.get("pelakFilter") || undefined;
  const discFilter = url.searchParams.get("discFilter") || undefined;
  const paydiscriptionFilter = url.searchParams.get("paydiscriptionFilter") || undefined;
  const invitedateFrom = url.searchParams.get("invitedateFrom") || undefined;
  const invitedateTo = url.searchParams.get("invitedateTo") || undefined;
  const paydateFrom = url.searchParams.get("paydateFrom") || undefined;
  const paydateTo = url.searchParams.get("paydateTo") || undefined;
  const created_atFrom = url.searchParams.get("created_atFrom") || undefined;
  const created_atTo = url.searchParams.get("created_atTo") || undefined;
  const updated_atFrom = url.searchParams.get("updated_atFrom") || undefined;
  const updated_atTo = url.searchParams.get("updated_atTo") || undefined;
  const priceMin = url.searchParams.get("priceMin") ? parseFloat(url.searchParams.get("priceMin")!) : undefined;
  const priceMax = url.searchParams.get("priceMax") ? parseFloat(url.searchParams.get("priceMax")!) : undefined;
  const discountMin = url.searchParams.get("discountMin") ? parseFloat(url.searchParams.get("discountMin")!) : undefined;
  const discountMax = url.searchParams.get("discountMax") ? parseFloat(url.searchParams.get("discountMax")!) : undefined;
  const created_user = url.searchParams.get("created_user") ? parseInt(url.searchParams.get("created_user")!) : undefined;
  const updated_user = url.searchParams.get("updated_user") ? parseInt(url.searchParams.get("updated_user")!) : undefined;

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
        { disc: { contains: search } },
        { paydiscription: { contains: search } },
      ];
    }

    // Advanced filters (AND conditions)
    // Note: pelak1 takes precedence over pelakFilter if both are set
    if (pelak1 && pelak1 !== 'all') {
      whereClause.pelak = pelak1;
    } else if (pelakFilter) {
      whereClause.pelak = { contains: pelakFilter };
    }
    if (discFilter) {
      whereClause.disc = { contains: discFilter };
    }
    if (paydiscriptionFilter) {
      whereClause.paydiscription = { contains: paydiscriptionFilter };
    }

    // Date range filters
    if (invitedateFrom || invitedateTo) {
      whereClause.invitedate = {};
      if (invitedateFrom) {
        whereClause.invitedate.gte = invitedateFrom;
      }
      if (invitedateTo) {
        whereClause.invitedate.lte = invitedateTo;
      }
    }

    if (paydateFrom || paydateTo) {
      whereClause.paydate = {};
      if (paydateFrom) {
        whereClause.paydate.gte = paydateFrom;
      }
      if (paydateTo) {
        whereClause.paydate.lte = paydateTo;
      }
    }

    if (created_atFrom || created_atTo) {
      whereClause.created_at = {};
      if (created_atFrom) {
        whereClause.created_at.gte = created_atFrom;
      }
      if (created_atTo) {
        whereClause.created_at.lte = created_atTo;
      }
    }

    if (updated_atFrom || updated_atTo) {
      whereClause.updated_at = {};
      if (updated_atFrom) {
        whereClause.updated_at.gte = updated_atFrom;
      }
      if (updated_atTo) {
        whereClause.updated_at.lte = updated_atTo;
      }
    }

    // Price range filter
    if (priceMin !== undefined || priceMax !== undefined) {
      whereClause.price = {};
      if (priceMin !== undefined) {
        whereClause.price.gte = priceMin;
      }
      if (priceMax !== undefined) {
        whereClause.price.lte = priceMax;
      }
    }

    // Discount range filter
    if (discountMin !== undefined || discountMax !== undefined) {
      // @ts-ignore - discount field exists in database but Prisma types need regeneration
      whereClause.discount = {};
      if (discountMin !== undefined) {
        whereClause.discount.gte = discountMin;
      }
      if (discountMax !== undefined) {
        whereClause.discount.lte = discountMax;
      }
    }

    // User filters
    if (created_user !== undefined) {
      whereClause.created_user = created_user;
    }
    if (updated_user !== undefined) {
      whereClause.updated_user = updated_user;
    }

    const response = await client.sarghofli.findMany({
      where: whereClause,
      select: ({
        _count: true,
        id: true,
        pelak: true,
        disc: true,
        price: true,
        discount: true,
        paydiscription: true,
        created_at: true,
        created_user: true,
        updated_at: true,
        updated_user: true, 
        invitedate: true,
        paydate: true,
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
          where: { moduleID: 3 },
        },
      } as any),

      orderBy: {
        id: "desc",
      },
      // include:{maghtatbl:true},
      take: 100,
    });

      //const ttakh=await client.store.findMany( {where: { pelak:store?.pelak.split('-')[0]+'-'+store?.pelak.split('-')[1] }})
    

    const docList = await client.doc_cat.findMany({
      select: {
        id: true,
        title: true,
        moduleId: true,
      },
      where: {
        moduleId: 3,
      },
    });


 const cc= await client.store.findUnique({
      where: {
        pelak:pelak1?.toUpperCase(),
      },
      select: {
        metraj: true,
      },
    })
  //  console.log("cc",pelak1?.toUpperCase());
   // console.log("cc pelak",cc);

    const combinedResults = response.map(owner => {
      return { ...owner, list: docList ,metraj:cc?.metraj};
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
