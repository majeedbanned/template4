import { string, z } from "zod";

export const Tenantschema = z.object({
  pelak: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(4, { message: "*" }),
  trow: z.number(),
  tfname: z.string().optional(),
  tlname: z.string().optional(),
  tfather: z.string().optional(),
  tjob: z.string().optional(),
  tmobile: z.string().optional(),
  ttel: z.string().optional(),
  taddress: z.string().optional(),
  tmeli: z.string().optional(),
  stdate: z.string().optional(),
  endate: z.string().optional(),
  sex: z.string().optional(),
  cposti: z.string().optional(),
  // storePelak: z.string().optional(),
});

export const Robschema = z.object({
  id: z.number(),
  pelak: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(4, { message: "*" }),
  invitedate: z.string().optional(),
  paydiscription: z.string().optional(),
  paydate: z.string().optional(),
  price: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .transform((val) => removeCommas(val.toString()))
    .or(z.string().min(1, { message: "این فیلد اجباری است" })),

  disc: z.string().optional(),
  created_at: z.string().optional(),
  created_user: z.number(),
  updated_at: z.string().optional(),
  updated_user: z.number(),
});

export const Ownerschema = z.object({
  pelak: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(4, { message: "*" }),
  trow: z.number(),
  tfname: z.string().optional(),
  tlname: z.string().optional(),
  tfather: z.string().optional(),
  tjob: z.string().optional(),
  tmobile: z.string().optional(),
  ttel: z.string().optional(),
  taddress: z.string().optional(),
  tmeli: z.string().optional(),
  // stdate: z.string().optional(),
  // endate: z.string().optional(),
  sex: z.string().optional(),
  cposti: z.string().optional(),
  // storePelak: z.string().optional(),
});

const EducationSchema = z.object({
  systems: z.string().optional(),
  locations: z.array(z.string()),
});

export const Rahroschema = z.object({
  id: z.number(),
  rahro: z.string().min(1, { message: "این فیلد اجباری است" }),
});
export const Novschema = z.object({
  id: z.number(),
  nov: z.string().min(1, { message: "این فیلد اجباری است" }),
});
export const Bazarschema = z.object({
  id: z.number(),
  bazar: z.string().min(1, { message: "این فیلد اجباری است" }),
});
export const Tabaghschema = z.object({
  id: z.number(),
  tabagh: z.string().min(1, { message: "این فیلد اجباری است" }),
});

export const Userschema = z.object({
  id: z.number(),
  name: z.string(),
  lname: z.string(),
  username: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(4, { message: "*" }),
  password: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(4, { message: "*" }),
  role: z.string().min(4, { message: "*" }),
  active: z.boolean().default(false).optional(),

  access: z.array(EducationSchema).optional(),
});

export const Chargedefschema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "این فیلد اجباری است" }),
  charge: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .transform((val) => removeCommas(val.toString()))
    .or(z.string().min(1, { message: "این فیلد اجباری است" })),
  penaltyPersand: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .transform((val) => removeCommas(val.toString()))
    .or(z.string().min(1, { message: "این فیلد اجباری است" })),
  penaltyMonth: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .transform((val) => removeCommas(val.toString()))
    .or(z.string().min(1, { message: "این فیلد اجباری است" })),

  type: z.string().min(1, { message: "این فیلد اجباری است" }),
});

export const Discountdefschema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "این فیلد اجباری است" }),

  discountPersand: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .transform((val) => removeCommas(val.toString()))
    .or(z.string().min(1, { message: "این فیلد اجباری است" })),
});

export const Chargechema = z.object({
  updated_at: z.string().optional(),
  created_at: z.string().optional(),
  created_user: z.number(),
  updated_user: z.number(),
  id: z.number(),
  pelak: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(4, { message: "*" }),
  month: z.string(),
  monthbill: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),
  // .pipe(
  //   z.coerce
  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })
  // )
  debt: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),
  // .pipe(
  //   z.coerce
  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })
  // )
  penalty: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),
  // .pipe(
  //   z.coerce
  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })
  // )
  deptPeriod: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),
  // .pipe(
  //   z.coerce
  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })
  // )
  deadline: z.string(),
  isueeDate: z.string(),
  TotalBill: z.any(),
  // .number({
  //   required_error:"1مقدار عددی  وارد کنید",
  //   invalid_type_error: "2مقدار عددی  وارد کنید",
  // })
  // .min(0,{ message: "3مقدار عددی مثبت وارد کنید" })
  // .or(z.string())
  // .pipe(
  //   z.coerce
  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })
  // )

  paidBill: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),

  ezafPardakht: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),
  // .pipe(
  //   z.coerce
  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })
  // )
  paidExtra: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),
  // .pipe(
  //   z.coerce
  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })
  // )
  paidDate: z.string(),
  paidType: z.string(),
  paidTime: z.string(),
  discount: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })

    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .transform((val) => removeCommas(val.toString()))
    .or(z.string()),
  // .pipe(
  //   z.coerce

  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })

  // )
  discription: z.string(),
  fichnum: z.string(),

  discountDiscription: z.string(),
  paidExtraAsset: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),
  // .pipe(
  //   z.coerce
  //     .number({
  //       invalid_type_error: "5مقدار عددی  وارد کنید",
  //     })
  //     .min(0,{ message: "6مقدار عددی مثبت وارد کنید" })
  // )
});

const removeCommas = (input: string) => {
  return input.replace(/,/g, "");
};
export const StoreSchema = z.object({
  pelakCH: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(1, { message: "*" })
    .max(1, { message: "*" }),
  pelakNU: z
    .string({
      invalid_type_error: "کاراکتر",
    })
    .min(4, { message: "*" })
    .max(4, { message: "*" }),

  name: z.string().optional(),
  nov: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1, { message: "لطفا این فیلد را انتخاب کنید" })
    .max(2),
  metraj: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .positive({ message: "3مقدار عددی مثبت وارد کنید" })
    // .int({ message: "4مقدار عددی  وارد کنید" })
    .or(z.string())
    .pipe(
      z.coerce
        .number({
          invalid_type_error: "5مقدار عددی  وارد کنید",
        })
        .positive({ message: "6مقدار عددی مثبت وارد کنید" })
      //.int({ message: "Value must be an integer" })
    ),

  bazar: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1, { message: "لطفا این فیلد را انتخاب کنید" })
    .max(2),
  tabagh: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1, { message: "لطفا این فیلد را انتخاب کنید" })
    .max(2),
  rahro: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1, { message: "لطفا این فیلد را انتخاب کنید" })
    .max(2),
  chargeProfile: z
    .string({
      required_error: "این فیلد اجباری است",
    })
    .min(1, { message: "لطفا این فیلد را انتخاب کنید" })
    .max(2),

  ejareh: z
    .number({
      required_error: "1مقدار عددی  وارد کنید",
      invalid_type_error: "2مقدار عددی  وارد کنید",
    })
    .min(0, { message: "3مقدار عددی مثبت وارد کنید" })
    .or(z.string()),

  tel1: z.string().optional(),
  tel2: z.string().optional(),
  cposti: z.string().optional(),
  Tahvil: z.string().optional(),
  active: z.boolean().default(false).optional(),
  ChekGift: z.boolean().default(false).optional(),
  ChekRol: z.string().optional(),
  tovzeh: z.string().optional(),
});
