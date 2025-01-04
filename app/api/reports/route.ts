import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { getServerSession } from "next-auth";
import { log } from "@/lib/utils";

import client from "@/lib/prismadb1";
import { Prisma } from "@prisma/client";

import { z } from "zod";
import { StoreSchema } from "@/lib/schemas";

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

  const res: z.infer<typeof StoreSchema> = await req.json();

  //** pars request body */
  const validation = StoreSchema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    return NextResponse.json(errors, {
      status: 400,
    });
  }

  //** check for duplicate pelak */
  const { pelakCH, pelakNU } = res;

  const [pelakExist] = await Promise.all([
    client.store.findUnique({
      where: {
        pelak: pelakNU + "-" + pelakCH.toUpperCase(),
      },
      select: {
        pelak: true,
      },
    }),
  ]);

  if (pelakExist) {
    return NextResponse.json(
      { message: "pelak is allredy used" },
      {
        status: 422,
      }
    );
  }

  const newres = {
    ...res,
    pelak: res.pelakNU + "-" + res.pelakCH.toUpperCase(),
    nov: parseInt(res.nov),
    tabagh: parseInt(res.tabagh),
    rahro: parseInt(res.rahro),
    bazar: parseInt(res.bazar),
    chargeProfile: parseInt(res.chargeProfile),
    ejareh: parseInt(res.ejareh.toString().replace(/,/g, "")),
  };
  // @ts-ignore: Unreachable code error
  delete newres.pelakNU;
  // @ts-ignore: Unreachable code error
  delete newres.pelakCH;

  const response = await client.store.create({
    data: newres,
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

  const res: z.infer<typeof StoreSchema> = await req.json();

  //** pars request body */
  const validation = StoreSchema.safeParse(res);
  if (!validation.success) {
    const { errors } = validation.error;
    //   //console.log(errors);
    return NextResponse.json(errors, {
      status: 400,
      statusText: "s1",
    });
  }

  const newres = {
    ...res,
    nov: parseInt(res.nov),
    tabagh: parseInt(res.tabagh),
    rahro: parseInt(res.rahro),
    bazar: parseInt(res.bazar),
    chargeProfile: parseInt(res.chargeProfile),
    ejareh: parseInt(res.ejareh.toString().replace(/,/g, "")),
  };
  // @ts-ignore: Unreachable code error
  delete newres.pelakNU;
  // @ts-ignore: Unreachable code error
  delete newres.pelakCH;

  const response = await client.store.update({
    where: {
      pelak: res.pelakNU + "-" + res.pelakCH,
    },
    data: newres,
  });

  return NextResponse.json(response, {
    status: 200,
  });
}
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;

  const active =
    url.searchParams.get("active")?.toString().split(",").toString() ||
    undefined;


    const shive =
    url.searchParams.get("shive")?.toString().split(",").toString() ||
    undefined;

    const tajmi =
    url.searchParams.get("tajmi")?.toString().split(",").toString() ||
    undefined;



  const fromdate =
    url.searchParams.get("fromdate")?.toString().split(",").toString() ||
    undefined;

  const todate =
    url.searchParams.get("todate")?.toString().split(",").toString() ||
    undefined;

  const sort =
    url.searchParams.get("sort")?.toString().split(",").toString() || undefined;

  const rahro =
    url.searchParams.get("rahro")?.toString().split(",").map(Number) ||
    undefined;
  const tabagh =
    url.searchParams.get("tabagh")?.toString().split(",").map(Number) ||
    undefined;
  const bazar =
    url.searchParams.get("bazar")?.toString().split(",").map(Number) ||
    undefined;

  const pardakht =
    url.searchParams.get("pardakht")?.toString().split(",").map(Number) ||
    undefined;

    const npardakht =
    url.searchParams.get("npardakht")?.toString().split(",").map(Number) ||
    undefined;

  const nov =
    url.searchParams.get("nov")?.toString().split(",").map(Number) || undefined;

  const profile =
    url.searchParams.get("profile")?.toString().split(",").map(Number) ||
    undefined;

  const debt =
    url.searchParams.get("debt")?.toString().split(",").map(Number) ||
    undefined;

  const date =
    url.searchParams.get("date")?.toString().split(",").map(String) ||
    undefined;
  // //console.log(date)
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
    // const response = await client.store.findMany({
    //   where: {
    //     ...(search && {
    //       OR: [{ pelak: { contains: search } }, { name: { contains: search } }],
    //     }),

    //     ...(rahro && {
    //       rahro: { in: rahro },
    //     }),

    //     ...(active === "1" && {
    //       active: Boolean(1),
    //     }),
    //     ...(active === "0" && {
    //       active: Boolean(0),
    //     }),

    //     ...(nov && {
    //       nov: { in: nov },
    //     }),
    //     ...(tabagh && {
    //       tabagh: { in: tabagh },
    //     }),
    //     ...(bazar && {
    //       bazar: { in: bazar },
    //     }),
    //     ...(profile && {
    //       chargeProfile: { in: profile },
    //     }),
    //   },
    //   include: {
    //     // select:{   pelak: true,
    //     // name: true,
    //     // metraj: true,
    //     // ejareh: true,
    //     // tel1: true,
    //     // tel2: true,
    //     // active: true,
    //     // tovzeh: true},
    //     types_rahro: { select: { id: true, rahro: true } },
    //     types_bazar: { select: { id: true, bazar: true } },
    //     types_nov: { select: { nov: true } },
    //     types_tabagh: { select: { tabagh: true } },
    //     chargeDef: { select: { name: true, charge: true, type: true } },
    //     stores_discounts: {
    //       select: {
    //         id: true,
    //         discountID: true,
    //         discountDef: { select: { name: true, discountPersand: true } },
    //       },
    //     },
    //     new_account: {
    //       select: {
    //         month: true,
    //         pelak: true,
    //         monthbill: true,
    //         deptPeriod: true,
    //         paidBill: true,
    //         debt: true,
    //         penalty: true,
    //         paidExtraAsset: true,
    //         discount: true,
    //         TotalBill: true,
    //       },
    //       //{ month: date },
    //       where: {
    //         ...(pardakht?.includes(2) && {
    //           paidBill: 0  ,
    //         }),

    //         ...(date && {
    //           month: date,
    //         }),
    //       },
    //     },
    //   },

    //   // include:{
    //   //   new_account:{where:{paidBill:''}}
    //   // },
    //   orderBy: {
    //     pelak: "desc",
    //   },
    //   // include:{maghtatbl:true},
    //   take: 100,
    // });
let title="";
    let fromdateq = "";
    if (fromdate) {
      title+="["+" از تاریخ: "+fromdate+"]"
      if (todate)
      {
      title+="["+" تا تاریخ: "+todate+"]"

        fromdateq = ` AND ((dbo.new_account.paidDate >= '${fromdate}'  or dbo.new_account.paidDate <= '${todate}'  ) 
                     OR (dbo.new_account.paidDate1 >= '${fromdate}' or dbo.new_account.paidDate1 <= '${todate}'  )) `;
      }
      else fromdateq = ` AND (dbo.new_account.paidDate = '${fromdate}' or dbo.new_account.paidDate1 = '${fromdate}'  ) `;
    }

    let novq = "";
    if (nov) {
     
      novq = ` AND (dbo.store.nov in (${nov}) ) `;
      const _nov=await client.types_nov.findMany({where:{id: {
        in: nov 
      }}})
      title+="["+"  نوع: "+ _nov?.map(item => item.nov).join(', ')+"]"

    }
    let rahroq = "";
    if (rahro) {
      rahroq = ` AND (dbo.store.rahro in (${rahro}) ) `;
    
      const _nov=await client.types_rahro.findMany({where:{id: {
        in: rahro 
      }}})
      title+="["+"  راهرو: "+ _nov?.map(item => item.rahro).join(', ')+"]"

    }
    let sortq = "";
    if (sort) {
      sortq = sort === "r" ? " newid()" : " dbo.new_account.paidDate ";
    } else {
      sortq = " dbo.new_account.paidDate ";
    }
    let bazarq = "";
    if (bazar) {
      bazarq = ` AND (dbo.store.bazar in (${bazar}) ) `;

      const _nov=await client.types_bazar.findMany({where:{id: {
        in: bazar 
      }}})
      title+="["+"  بلوک: "+ _nov?.map(item => item.bazar).join(', ')+"]"

    }
    let tabaghq = "";
    if (tabagh) {
      tabaghq = ` AND (dbo.store.tabagh in (${tabagh}) ) `;

      const _nov=await client.types_tabagh.findMany({where:{id: {
        in: tabagh 
      }}})
      title+="["+"  تراز: "+ _nov?.map(item => item.tabagh).join(', ')+"]"

    }
    let debtq = "";
    let debtqmessage="";
    if (debt) {
      if (debt?.includes(1)) {
        debtq = ` AND (dbo.new_account.deptPeriod>0 and dbo.new_account.deptPeriod<=5 ) `;
        debtqmessage+=' 1 تا 5 دوره '

      }
      if (debt?.includes(2)) {
        debtq = ` AND (dbo.new_account.deptPeriod>=6  ) `;
        debtqmessage+=' 6 دوره به بالا '

      }

      if (debt?.includes(3)) {
        debtq = ` AND (dbo.new_account.deptPeriod>=2 and dbo.new_account.deptPeriod<=5 ) `;
        debtqmessage+=' 2 تا 5 دوره '

      }

      title+="["+"  دوره بدهی: "+debtqmessage+"]"

    }

    const wrappedStrings = date?.map((str) => `'${str}'`);

    let dateq = "";
    if (date) {
      dateq = ` AND (dbo.new_account.month in (${wrappedStrings}) ) `;
 console.log(wrappedStrings)
      title+="["+"  دوره: "+ wrappedStrings?.map(str => str.replace(/'/g, '')) // remove single quotes
      .join(',')+"]"

    } else {
     // dateq = ` AND (dbo.new_account.month ='1402-05' ) `;
    }
    let activeq = "";
    if (active) {
      activeq = ` AND (dbo.store.active in (${active}) ) `;

     console.log("??",active)
     let _vaz;
     if(active==="1")
      _vaz=" فعال "
     else if(active==="0")
      _vaz=" غیر فعال "
    else if(active==="1,0")
      _vaz="  فعال و غیر فعال "
    else if(active==="0,1")
      _vaz="  فعال و غیر فعال "
        title+="["+"  وضعیت: "+ _vaz+"]"
    }
    let shiveq = "";
    if (shive) {
      shiveq = ` AND (dbo.store.aghsat in (${shive}) ) `;


      let _vaz;
      if(shive==="1")
       _vaz=" اقساطی "
      else if(shive==="2")
       _vaz=" نقدی"
     else if(shive==="1,2")
       _vaz="  اقساطی  نقدی "
     else if(shive==="2,1")
       _vaz="  اقساطی  نقدی "
         title+="["+"  شیوه پرداخت: "+ _vaz+"]"
    }

    let tajmiq = "";
    if (tajmi) {
      tajmiq = ` AND (dbo.store.tajmi in (${tajmi}) ) `;


      let _vaz;
      if(tajmi==="1")
       _vaz=" بلی "
      else if(tajmi==="2")
       _vaz=" خیر"
     else if(tajmi==="1,2")
       _vaz="  خیر  بلی "
     else if(tajmi==="2,1")
       _vaz="  خیر  بلی "
         title+="["+"  تجمیع : "+ _vaz+"]"

    }


    let npardakhtq = "";
    let npardakhtqmessage = "";

    if (npardakht) {

      if (npardakht?.includes(1)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'پوز' ) or`

        npardakhtqmessage+= ' پوز '
      }
      if (npardakht?.includes(2)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'پرداخت آنلاین' ) or`
        npardakhtqmessage+= ' پرداخت آنلاین '

      }
      if (npardakht?.includes(3)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'واریز به حساب' ) or`

        npardakhtqmessage+= ' واریز به حساب '

      }
      if (npardakht?.includes(4)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'پوز اطلاعات' ) or`

        npardakhtqmessage+= ' پوز اطلاعات '

      }
      if (npardakht?.includes(5)) {
        npardakhtq +=`  (dbo.new_account.paidtype = N'پوز دفتر مرکزی' ) or`
        npardakhtqmessage+='پوز دفتر مرکزی'

        
      }
      npardakhtq = ` AND ( ${npardakhtq.substring(0, npardakhtq.length - 2)} ) `;

      title+="["+"  روش پرداخت: "+ npardakhtqmessage  +"]"

    }



    let pardakhtq = "";
    if (pardakht?.includes(1)) {
      pardakhtq = ` AND (dbo.new_account.paidBill= dbo.new_account.TotalBill 
                         or dbo.new_account.TotalBill=0) `;

        title+="["+"  وضعیت پرداخت: "+ " پرداخت شده "  +"]"


    }

    let pardakhtqB = "";
    if (pardakht?.includes(2)) {
      pardakhtqB = ` AND (dbo.new_account.paidBill<dbo.new_account.TotalBill 
                         ) `;
        title+="["+"  وضعیت پرداخت: "+ "  بدهی دارد "  +"]"

    }

    let searchq = "";
    if (search) {
      searchq = ` AND (dbo.store.pelak like '%${search}%' or dbo.store.name like '%${search}%' 
      or cast(dbo.new_account.paidBill as nvarchar) = '${search}' 
      or cast(dbo.new_account.TotalBill as nvarchar) = '${search}'
      or dbo.new_account.fichnum  like '%${search}%' 
      or dbo.new_account.fich1  like '%${search}%'
      or dbo.new_account.fich2  like '%${search}%'
      or dbo.new_account.fich3  like '%${search}%'
      or cast(dbo.new_account.paidBill3 as nvarchar) = '${search}' 
      or cast(dbo.new_account.paidBill2 as nvarchar) = '${search}'
      or cast(dbo.new_account.paidBill1 as nvarchar) = '${search}')

      
      `;
      title+="["+" جستجو : "+ search +"]"
     
    }

    // const serializedIds = JSON.stringify(ids);
console.log(title)
    const query=`
   SELECT  '${title}' as title,   dbo.store.name, dbo.store.pelak, dbo.types_bazar.bazar, dbo.types_tabagh.tabagh, dbo.types_nov.nov, dbo.types_rahro.rahro, dbo.new_account.month, dbo.store.active,dbo.store.metraj, dbo.new_account.deptPeriod,dbo.new_account.paidDate,dbo.new_account.paidDate1, new_account.debt,new_account.penalty,
   dbo.store.aghsat, dbo.store.tajmi,  dbo.new_account.TotalBill,dbo.new_account.rrn, dbo.new_account.paidBill, dbo.new_account.paidBill1,dbo.new_account.paidBill2,dbo.new_account.paidBill3,dbo.new_account.discription,dbo.new_account.fichnum
FROM            dbo.new_account INNER JOIN
                         dbo.store ON dbo.new_account.pelak = dbo.store.pelak INNER JOIN
                         dbo.types_bazar ON dbo.store.bazar = dbo.types_bazar.id INNER JOIN
                         dbo.types_nov ON dbo.store.nov = dbo.types_nov.id INNER JOIN
                         dbo.types_rahro ON dbo.store.rahro = dbo.types_rahro.id INNER JOIN
                         dbo.types_tabagh ON dbo.store.tabagh = dbo.types_tabagh.id
                         where 1=1 ${novq} ${rahroq} ${bazarq} ${tabaghq} ${dateq}
                         ${activeq} ${searchq} ${pardakhtq} ${pardakhtqB} ${debtq} ${fromdateq} ${npardakhtq} ${shiveq} ${tajmiq} order by ${sortq}`;
 //console.log(query)
                         const response = await client.$queryRawUnsafe(query);

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
    //console.log(error.message);
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
