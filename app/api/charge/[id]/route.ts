import client from "@/lib/prismadb1";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import jalaliMoment from "jalali-moment";
import { Decimal } from "@prisma/client/runtime";
// import jalaliMoment from 'jalali-moment'
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

  const store = await client.new_account.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json(store, {
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

  let firstRecord = {
    pelak: "",
    penalty: 0,
    TotalBill: 0,
    paidBill: 0,
    month: "",
    monthbill: 0,
    debt: 0,
    deptPeriod: 0,
    deadline: "",
    isueeDate: "",
    paidDate: "",
    paidExtra: 0,
    paidTime: "",
    paidType: "",
    discount: 0,
    discountDiscription: "",
    discription: "",
    paidExtraAsset: 0,
  };

  // Convert the Gregorian date to Persian (Jalali) date using jalali-moment
  //let today=moment(currentDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')

  const pelak = params.id.toUpperCase();
  const currentDate = jalaliMoment().format("jYYYY/jMM/jDD");
  const currentMonth = jalaliMoment().format("jYYYY/jMM");

  const lastCharge = await client.new_account.findMany({
    where: { pelak: pelak },
    take: 1,
    orderBy: { id: "desc" },
  });
  const store = await client.store.findUnique({
    where: { pelak: pelak },
  });
  const chargeProfile = await client.chargeDef.findUnique({
    where: { id: store?.chargeProfile || 0 },
  });

  const metraj = Number(store?.metraj ?? 0);
  const charge = chargeProfile?.charge ?? 0;
  const _chargeBill = metraj * Number(charge);

  //its the first charge of client
  if (lastCharge.length === 0) {
    firstRecord.pelak = pelak;
    firstRecord.month = currentMonth;
    firstRecord.monthbill = _chargeBill;

    return NextResponse.json(firstRecord, {
      status: 200,
    });
  }

  const initialDate = jalaliMoment(
    lastCharge[0].month?.toString(),
    "jYYYY-jMM"
  );
  const nextMonthDate = initialDate.add(1, "jMonth").format("jYYYY-jMM");

  console.log('inid',lastCharge[0].month?.toString())
  firstRecord.pelak = pelak;
  firstRecord.month = nextMonthDate;
  firstRecord.monthbill = _chargeBill;

  //Debt:

  let _debt;
  //اگر ماه پبش کامل پرداخت کرده
  if (lastCharge[0].paidBill === lastCharge[0].TotalBill) {
    firstRecord.debt = 0;
  }
  //اگر ماه پبش کمتر پرداخت کرده
  else if (lastCharge[0].paidBill < (lastCharge[0].TotalBill ?? 0)) {
    firstRecord.debt =
      Number(lastCharge[0].TotalBill) - Number(lastCharge[0].paidBill);

    // if(true) {
    //   //اگر ماه پبش کمتر پرداخت کرده
    //   if (Number(lastCharge[0].paidExtraAsset) === 0)
    //     firstRecord.debt =
    //       Number(lastCharge[0].TotalBill) - Number(lastCharge[0].paidBill);
    //   else {
    //     let tmpDebt =
    //       Number(lastCharge[0].TotalBill) - Number(lastCharge[0].paidBill);
    //     let tmp1 = Number(lastCharge[0].paidExtraAsset) - tmpDebt;

    //     //حساب صاف میشود
    //     if (tmp1 === 0) {
    //       firstRecord.debt = 0;
    //       firstRecord.paidExtraAsset = 0;
    //     } else if (tmp1 > 0) {
    //       firstRecord.debt = 0;
    //       firstRecord.paidExtraAsset = tmp1;
    //     } else if (tmp1 < 0) {
    //       firstRecord.debt = -tmp1;
    //       firstRecord.paidExtraAsset = 0;
    //     }
    //   }
    // }
  }

  //penalty:

  if (
    Number(lastCharge[0].deptPeriod) + 1 >=
    Number(chargeProfile?.penaltyMonth)
  ) {
    // console.log( Number(lastCharge[0].deptPeriod)+1)
    if (Number(lastCharge[0].paidBill) === 0)
     { firstRecord.penalty =
      Math.round( (Number(chargeProfile?.penaltyPersand) / 100) *
        Number(lastCharge[0].TotalBill));
        // console.log((Number(chargeProfile?.penaltyPersand) / 100) *
        // Number(lastCharge[0].TotalBill))
        firstRecord.deptPeriod =Number(firstRecord.deptPeriod)+1
      }
  }

  // deptPeriod

  if (lastCharge[0].paidBill === lastCharge[0].TotalBill)
    firstRecord = { ...firstRecord, deptPeriod: 0 };
  else
    firstRecord = {
      ...firstRecord,
      deptPeriod: Number(firstRecord.deptPeriod) + 1,
    };
  // firstRecord.deptPeriod = Number(firstRecord.deptPeriod) + 1;

  //paid extra

  if (true) {
    //اگر ماه پبش کمتر پرداخت کرده
    if (Number(lastCharge[0].paidExtraAsset) === 0) firstRecord.paidExtra = 0;
    else {
      let tmpTotalpay =
        Number(firstRecord.monthbill) +
        Number(firstRecord.debt) +
        Number(firstRecord.penalty);

      let tmp1 = Number(lastCharge[0].paidExtraAsset) - tmpTotalpay;
//console.log(tmpTotalpay)
      //حساب صاف میشود
      if (tmp1 === 0) {
        firstRecord.paidExtraAsset = 0;
        firstRecord.paidExtra = Number(lastCharge[0].paidExtraAsset);
        firstRecord.paidBill = Number(lastCharge[0].paidExtraAsset);

      } else if (tmp1 > 0) {
        firstRecord.paidExtraAsset = tmp1;
        firstRecord.paidExtra = tmpTotalpay;
        firstRecord.paidBill = tmpTotalpay;

      } else if (tmp1 < 0) {
        firstRecord.paidExtra = Number(lastCharge[0].paidExtraAsset);
        firstRecord.paidExtraAsset = 0;
        firstRecord.paidBill = Number(lastCharge[0].paidExtraAsset);

      }
    }
  }
  firstRecord.TotalBill =
    Number(firstRecord.monthbill) +
    Number(firstRecord.debt) +
    Number(firstRecord.penalty) -
    Number(firstRecord.paidExtra);

  return NextResponse.json(firstRecord, {
    status: 200,
  });

  // const store = await client.store.findUnique({
  //   where: { pelak: id },
  // });
  //   const res = {
  //     ...store,
  //     nov: store?.nov?.toString(),
  //     tabagh: store?.tabagh?.toString(),
  //     rahro: store?.rahro?.toString(),
  //     bazar: store?.bazar?.toString(),
  //     pelakNU:store?.pelak.split('-')[0],
  //     pelakCH:store?.pelak.split('-')[1]

  //   };
  // return NextResponse.json(res, {
  //   status: 200,
  // });
}
