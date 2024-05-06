import client from "@/lib/prismadb1";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import jalaliMoment from "jalali-moment";
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
    updated_at: "-",
    created_at: "1",
    created_user: 0,
    updated_user: 0,
    id: 0,
    pelak: "",
    penalty: 0,
    TotalBill: 0,
    paidBill: 0,
    paidBill1: 0,
    paidBill2: 0,
    paidBill3: 0,

    ezafPardakht: 0,
    month: "",
    monthbill: 0,
    debt: 0,
    deptPeriod: 0,
    deadline: "",
    isueeDate: "",
    paidDate: "",
    paidDate1: "",
    paidDate2: "",
    paidDate3: "",

    paidExtra: 0,
    paidTime: "",
    paidType: "",
    discount: 0,
    discountDiscription: "",
    fichnum:'',
    fich1:'',
    fich2:'',
    fich3:'',

    discription: "",
    paidExtraAsset: 0,
    basebill:0
  };

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
    include: {
      chargeDef: { select: { name: true, charge: true, type: true } },
      stores_discounts: {
        select: {
          id: true,
          discountID: true,
          discountDef: { select: { name: true, discountPersand: true } },
        },
      },
    },
  });
  const chargeProfile = await client.chargeDef.findUnique({
    where: { id: store?.chargeProfile || 0 },
  });

  ////takhfif
  let takhfif = store?.stores_discounts.reduce(function (s, a) {
    return s + Number(a.discountDef?.discountPersand);
  }, 0);
  ///////////
  const metraj = Number(store?.metraj ?? 0);
  const charge = chargeProfile?.charge ?? 0;
  let _chargeBill = 0;
  const ejareh = store?.ejareh ?? 0;
  _chargeBill =
    ejareh !== 0
      ? Number(ejareh)
      : (Number(takhfif) / 100) * (metraj * Number(charge));
  if (ejareh !== 0) _chargeBill = Number(ejareh);
  else {
    const kh = (Number(takhfif) / 100) * (metraj * Number(charge.toFixed(0)));

    if (chargeProfile?.type === "1")
      //tarefe beezaye metraj
      _chargeBill = Number((metraj * Number(charge) - kh).toFixed(0));
    else _chargeBill = Number(chargeProfile?.charge);
  }

  //basebill
  firstRecord.basebill= ejareh !== 0
  ? Number(ejareh)
  : (Number(charge));
  //firstRecord.basebill=200
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

  // console.log("inid", lastCharge[0].month?.toString());
  firstRecord.pelak = pelak;
  firstRecord.month = nextMonthDate;
  firstRecord.monthbill = _chargeBill;

  //Debt:

  let _debt;
  //اگر ماه پبش کامل پرداخت کرده
  if (Number(lastCharge[0].paidBill) === Number(lastCharge[0].TotalBill)) {
    firstRecord.debt = 0;
  }
  //اگر ماه پبش کمتر پرداخت کرده
  else if (
    Number(lastCharge[0].paidBill) < Number(lastCharge[0].TotalBill ?? 0)
  ) {
    firstRecord.debt =
      Number(lastCharge[0].TotalBill) -
    //  Number(lastCharge[0].penalty) -
      Number(lastCharge[0].paidBill);
  }
  console.log("TotalBill", lastCharge[0].TotalBill);
  console.log("penalty", lastCharge[0].penalty);
  console.log("paidBill", lastCharge[0].paidBill);

  //penalty:

  if (
    Number(lastCharge[0].deptPeriod) + 1 >=
    Number(chargeProfile?.penaltyMonth)
  ) {
    if (Number(lastCharge[0].paidBill) < Number(lastCharge[0].TotalBill)) {
      firstRecord.penalty = Math.round(
        (Number(chargeProfile?.penaltyPersand) / 100) *
          (Number(lastCharge[0].TotalBill) - Number(lastCharge[0].paidBill))
      );
      firstRecord.discount = firstRecord.penalty;
      firstRecord.deptPeriod = Number(lastCharge[0].deptPeriod) + 1;
    }
  }

  // deptPeriod

  if (
    Number(lastCharge[0].paidBill) === Number(lastCharge[0].TotalBill) ||
    Number(lastCharge[0].TotalBill) === 0
  )
    firstRecord = { ...firstRecord, deptPeriod: 0 };
  else
    firstRecord = {
      ...firstRecord,
      deptPeriod: Number(lastCharge[0].deptPeriod) + 1,
    };

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
        // firstRecord.paidBill = Number(lastCharge[0].paidExtraAsset);
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
}
