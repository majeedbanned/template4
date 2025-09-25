import React, { useRef } from "react";
import logo from "@/public/images/logofull.png";
import { QRCodeSVG } from "qrcode.react";
import { Store, User2 } from "lucide-react";
import "./custom-font.css";
import Image from "next/image";
type props = {
  data: any;
  store: any;
  chargeDef: any;
};
export const ComponentToPrint = React.forwardRef(
  ({ data, store, chargeDef }: props, ref) => {
    return (
      <div style={{ display: "none" }} className="pprint">
        <div
          //@ts-ignore
          ref={ref}
          dir="rtl"
          className="bg-white flex-col   gap-2 flex justify-center items-center rounded-lg  px-2 py-2    mt-2 mx-4"
        >
          <div className="flex w-full flex-row justify-between items-center flex-1">
            <div className=" p-2 font-bold">
              <p style={{ fontFamily: "CustomFont" }}>
                (علی الحساب) قبض پرداخت شارژ ماهیانه
              </p>
            </div>
            <div style={{ fontFamily: "CustomFont" }} className="p-2 font-bold">
              مجتمع خلیج فارس
            </div>
          </div>
          <table className="w-full mx-4">
            <tr className="h-10 border border-gray-800 bg-gray-100">
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                دوره جاری
              </th>
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                نام دارنده سرقفلی
              </th>
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                پلاک
              </th>
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                موقعیت
              </th>
            </tr>
            <tr className="h-10 ">
              <td
                style={{ fontFamily: "CustomFont" }}
                className=" text-center border border-gray-800 p-2"
              >
                {data?.month?.toString()}
              </td>
              <td
                style={{ fontFamily: "CustomFont" }}
                className="  text-center border border-gray-800 p-2"
              >
                {store?.name}
              </td>
              <td
                style={{ fontFamily: "CustomFont" }}
                className=" text-center border border-gray-800 p-2"
              >
                {data?.pelak}
              </td>
              <td
                style={{ fontFamily: "CustomFont" }}
                className=" text-center border border-gray-800 p-2"
              >
                {store?.types_tabagh.tabagh} - {store?.types_bazar.bazar} -{" "}
                {store?.types_rahro?.rahro}
              </td>
            </tr>
          </table>

          <table className="w-full mx-2">
            <tr className="h-10 border border-gray-800  bg-gray-100">
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                متراژ
              </th>
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                {chargeDef?.type === "1"
                  ? " مبلغ شارژ هر متر مربع"
                  : "مبلغ شارژ"}
              </th>
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                مبلغ شارژ این دوره
              </th>
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                دوره بدهی
              </th>
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                بدهی قبلی
              </th>
              <th
                style={{ fontFamily: "CustomFont" }}
                className="border border-gray-800 text-sm"
              >
                دیرکرد
              </th>
            </tr>
            <tr className="h-10 ">
              <td
                style={{ fontFamily: "CustomFont" }}
                className=" text-center border border-gray-800 p-2"
              >
                {store?.metraj}
              </td>
              <td
                style={{ fontFamily: "CustomFont" }}
                className="  text-center border border-gray-800 p-2"
              >
                {new Intl.NumberFormat("fa-IR", {
                  style: "currency",
                  currency: "IRR",
                })
                  .format(chargeDef?.charge)
                  .replace("ریال", "")}
              </td>
              <td
                style={{ fontFamily: "CustomFont" }}
                className=" text-center border border-gray-800 p-2"
              >
                {new Intl.NumberFormat("fa-IR", {
                  style: "currency",
                  currency: "IRR",
                })
                  .format(data?.monthbill)
                  .replace("ریال", "")}
              </td>
              <td
                style={{ fontFamily: "CustomFont" }}
                className=" text-center border border-gray-800 p-2"
              >
                {data?.deptPeriod}
              </td>
              <td
                style={{ fontFamily: "CustomFont" }}
                className=" text-center border border-gray-800 p-2"
              >
                {new Intl.NumberFormat("fa-IR", {
                  style: "currency",
                  currency: "IRR",
                })
                  .format(data?.debt)
                  .replace("ریال", "")}
              </td>
              <td
                style={{ fontFamily: "CustomFont" }}
                className=" text-center border border-gray-800 p-2"
              >
                {new Intl.NumberFormat("fa-IR", {
                  style: "currency",
                  currency: "IRR",
                })
                  .format(data?.penalty)
                  .replace("ریال", "")}
              </td>
            </tr>
          </table>

          <table className="w-full mx-2">
            <tr
              style={{ fontFamily: "CustomFont" }}
              className="h-10 border border-gray-800  bg-gray-100"
            >
              <th className="border border-gray-800 text-sm">
                بانک محل پرداخت
              </th>
              <th className="border border-gray-800 text-sm">نام صاحب حساب</th>
              <th className="border border-gray-800 text-sm">شماره حساب</th>
              <th className="border border-gray-800 text-sm">بستانکاری</th>
              <th className="border border-gray-800 text-sm">تخفیف</th>
            </tr>
            <tr style={{ fontFamily: "CustomFont" }} className="h-10 ">
              <td className=" text-center border border-gray-800 p-2">
                {/* پاسارگاد */}
              </td>
              <td className="  text-center border border-gray-800 p-2">
                {/* محمد حسنی */}
              </td>
              <td className=" text-center border border-gray-800 p-2">
                {/* 603799178800 */}
              </td>
              <td className=" text-center border border-gray-800 p-2">
                {new Intl.NumberFormat("fa-IR", {
                  style: "currency",
                  currency: "IRR",
                })
                  .format(data?.paidExtraAsset)
                  .replace("ریال", "")}
              </td>

              <td className=" text-center border border-gray-800 p-2">
                {new Intl.NumberFormat("fa-IR", {
                  style: "currency",
                  currency: "IRR",
                })
                  .format(data?.discount)
                  .replace("ریال", "")}
              </td>
            </tr>
          </table>

          <div className="flex flex-row flex-1 w-full gap-2  h-[340px]">
            <div
              style={{ fontFamily: "CustomFont" }}
              className="flex flex-col gap-2 flex-[.5] "
            >
              <div className="border border-gray-800 p-2 pb-2 ">
                مهلت پرداخت
                {/* <br /> */}
                <p className="text-center text-xl">
                  {data?.month.toString().replace("-", "/") + "/30"}
                </p>
                <p>مهلت داده شده شامل بدهی نمیشود</p>
              </div>
              <div className="border border-gray-800 p-2 pb-2  bg-gray-100">
                مبلغ قابل پرداخت
                <br />
                <p className="text-center text-2xl ">
                  {" "}
                  {new Intl.NumberFormat("fa-IR", {
                    style: "currency",
                    currency: "IRR",
                  })
                    .format(data?.TotalBill)
                    .replace("ریال", "")}
                </p>
              </div>
            </div>
            <div
              style={{ fontFamily: "CustomFont" }}
              className="border border-gray-800 flex flex-col flex-1 p-1 "
            >
              <div className="flex flex-1 flex-col justify-start">
                <p>بدون ثبت ماشینی اعتبار ندارد</p>

                <p>
                  پرداخت به صورت غیر حضوری توسط سامانه https://charge.pgcm.ir
                </p>

                <p> و یا از طریق وب کیوسک مستقر در مدیریت بازار اقدام نمایید</p>
              </div>
              {/* <div className="flex flex-row  justify-end">
                <Image src={logo} width={150} height={150} alt="Image" />
                <div className="flex flex-col">
                  <p className="text-sm">پرداخت آنلاین</p>
                  <QRCodeSVG size={80} value="https://charge.pgcm.ir/" />
                </div>
              </div> */}
            </div>
          </div>

          <div className="pagebreak"></div>

          <h1>Page 2</h1>
          <div className="pagebreak"></div>

          <h1>Page 3</h1>
        </div>
      </div>
    );
  }
);
ComponentToPrint.displayName = "MyComponent";

export default ComponentToPrint;
