import { z } from "zod";

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
      required_error:"1مقدار عددی  وارد کنید",
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
  tel1: z.string().optional(),
  tel2: z.string().optional(),
  cposti: z.string().optional(),
  Tahvil: z.string().optional(),
  active: z.boolean().default(false).optional(),
  ChekGift: z.boolean().default(false).optional(),
  ChekRol: z.string().optional(),
  tovzeh: z.string().optional(),
});
