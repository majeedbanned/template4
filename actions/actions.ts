"use server";
import jalaliMoment, { months } from "jalali-moment";

import client from "@/lib/prismadb1";
import { Select } from "@radix-ui/react-select";
import { revalidatePath } from "next/cache";
import { boolean, string } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const getfish = async (formData: FormData) => {
  const idate = formData.get("month");
  // data = await client.new_account.findMany({
  //   where: {
  //     month: "1402/06",
  //   },
  // });

 // //console.log(idate);
  revalidatePath("/autocharge");
};

export const getGroupPrint = async (
  month: string,
  nov: string,
  pelak: string,
  rahrovalue: string,
  vaziat: string
) => {
  let data;
  if (pelak === "") {
    data = await client.store.findMany({
      where: {
        ...(nov && { nov: Number(nov) }),
        ...(rahrovalue && {
          tabagh: Number(rahrovalue),
        }),
        ...(vaziat==='True' && {
          active:Boolean( 1),
        }),
        ...(vaziat==='False' && {
          active:Boolean( 0),
        }),
      },
      select: {
        types_tabagh: { select: { tabagh: true } },
        types_rahro: { select: { rahro: true } },
        types_bazar: { select: { bazar: true } },

        pelak: true,
        name: true,
        metraj: true,
        ChekRol: true,
        active: true,
        fine3:true,
        new_account: {
          select: {
            month: true,
            pelak: true,
            monthbill: true,
            deptPeriod: true,
            paidBill: true,
            debt: true,
            penalty: true,
            paidExtraAsset: true,
            discount: true,
            TotalBill: true,
            basebill:true,
          },
          where: { month: month },
        },
        chargeDef: { select: { type: true, charge: true } },
      },
      //  take: 10,
    });
  } else {
    data = await client.store.findMany({
      where: { AND: [{ pelak: pelak }] },
      select: {
        types_tabagh: { select: { tabagh: true } },
        types_rahro: { select: { rahro: true } },
        types_bazar: { select: { bazar: true } },

        pelak: true,
        name: true,
        metraj: true,
        ChekRol: true,
        fine3:true,
        active: true,
        new_account: {
          select: {
            month: true,
            pelak: true,
            monthbill: true,
            deptPeriod: true,
            paidBill: true,

            debt: true,
            penalty: true,
            paidExtraAsset: true,
            discount: true,
            TotalBill: true,
            basebill:true
          },
          where: { month: month },
        },
        chargeDef: { select: { type: true, charge: true } },
      },
      take: 1,
    });
  }

  return data;
};
export const getNov = async () => {
  const nov = await client.types_nov.findMany({});
  return nov;
};

export const getRahro = async () => {
  const rahro = await client.types_tabagh.findMany({});
  return rahro;
};
export const getfish1 = async (formData: string) => {
  //  return formData
  // const idate = formData.get("month");
  const _active = await client.store.findMany({
    where: {
      active: true,
      tajmi:false
    },
  });
  const _unactive = await client.store.findMany({
    where: {
      active: false,
      tajmi:false
    },
  });
  const issued = await client.store.findMany({});

  // const issued = await client.store.findMany({
  //   where: {
  //      OR:[{active:true},{active:false}],

  //   //   new_account:{some:{
  //   //     month:"1402/05"
  //   //   }}
  //    },
  //    include:{
  //      new_account:{select:{month:true}}
  //    }
  //   // select: {
  //   //   new_account: { select: { month: true }, where: { month: "1402/06" } },
  //   // },

  // });
  let count = 0;
  let ret;
  for (var j = 0; j < issued.length; j++) {
    ret = await newCharge(String(issued[j].pelak), formData);
    if (ret === "saved!") count++;
  }

  return {
    active: _active.length.toString(),
    _unactive: _unactive.length.toString(),
    issued: count,
  };
  // //console.log(idate)
  // revalidatePath("/autocharge");
};

export const newCharge = async (pelak: string, month: string) => {
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
fich1:'',
fich2:'',
fich3:'',

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
    discription: "",
    paidExtraAsset: 0,
    basebill:0
  };

  //if charge fich exist
  const exist = await client.new_account.findMany({
    where: { AND: [{ pelak: pelak }, { month: month }] },
    //where: { pelak: pelak, month: month }
    orderBy: { id: "desc" },
  });
  //   //console.log(exist)
  //   //console.log(pelak + ' '+ month)
  // return(exist.length)
  if (exist.length > 0) return "exist!";
  // //console.log('after return')

  // pelak = params.id.toUpperCase();
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

  firstRecord.basebill= ejareh !== 0
  ? Number(ejareh)
  : (Number(charge));
  
  //its the first charge of client
  if (lastCharge.length === 0) {
    firstRecord.pelak = pelak;
    firstRecord.month = currentMonth;
    firstRecord.monthbill = _chargeBill;

    // return NextResponse.json(firstRecord, {
    //   status: 200,
    // });
  }

  const initialDate = jalaliMoment(
    lastCharge[0].month?.toString(),
    "jYYYY-jMM"
  );
  const nextMonthDate = initialDate.add(1, "jMonth").format("jYYYY-jMM");

  // //console.log("inid", lastCharge[0].month?.toString());
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
    if (month === "1402-06") {
      firstRecord.debt =
        Number(lastCharge[0].TotalBill) -
        Number(lastCharge[0].penalty) -
        Number(lastCharge[0].paidBill);
    } else {
      firstRecord.debt =
        Number(lastCharge[0].TotalBill) -
       // Number(lastCharge[0].penalty) -
       // Number(lastCharge[0].discount) -
        Number(lastCharge[0].paidBill);
    }
  }
  ////console.log("TotalBill", lastCharge[0].TotalBill);
  // //console.log("penalty", lastCharge[0].penalty);
  // //console.log("paidBill", lastCharge[0].paidBill);

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

  //save to db
  // const session = await getServerSession(authOptions);

  const newres = {
    ...firstRecord,
    created_at: jalaliMoment().format("jYYYY/jMM/jDD HH:MM"),
    created_user: 1, //session?.user.id,
    updated_at: "",
    updated_user: 0,
  };
  const { TotalBill, id, ...newObject } = newres;

  const response = await client.new_account.create({
    data: newObject,
  });
  return "saved!";
};
