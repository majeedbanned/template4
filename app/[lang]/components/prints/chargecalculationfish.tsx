import React from "react";
import logo from "@/public/images/logofull.png";
import { QRCodeSVG } from "qrcode.react";
import "./custom-font.css";
import Image from "next/image";

type props = {
  data: {
    startDate: string;
    rate: number;
    totalCharge: number;
    totalPaidAmount: number;
    pelak?: string;
    name?: string;
  };
};

export const ChargeCalculationFish = React.forwardRef<HTMLDivElement, props>(
  ({ data }, ref) => {
    const remainingPayable = data.totalCharge - data.totalPaidAmount;
    
    return (
      <div style={{ display: "none" }} className="pprint">
        <div
          ref={ref}
          dir="rtl"
          className="bg-white flex-col gap-0 flex justify-center items-center border-2 w-full"
        >
          <div className="w-full px-2">
            <div className="flex flex-col justify-center w-full items-center px-2 py-0 mt-0 mx-0">
              <div className="flex w-full flex-row justify-between items-center flex-1">
                <div className="p-1 font-bold">
                  <p style={{ fontFamily: "CustomFont" }}>
                    اجاره سرقفلی واحد های تجاری مجتمع خلیج فارس
                  </p>
                </div>
                <div
                  style={{ fontFamily: "CustomFont" }}
                  className="p-1 font-bold"
                >
                  مجتمع خلیج فارس
                </div>
              </div>

              <table className="w-full mx-0">
                <tr className="h-8 border border-gray-800 bg-gray-100">
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
                    تاریخ دعوت نامه
                  </th>
                  <th
                    style={{ fontFamily: "CustomFont" }}
                    className="border border-gray-800 text-sm"
                  >
                    وضعیت
                  </th>
                </tr>
                <tr className="h-8">
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {data.name || "-"}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {data.pelak || "-"}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {data.startDate}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    فعال
                  </td>
                </tr>
              </table>

              <table className="w-full mx-0">
                <tr className="h-8 border border-gray-800 bg-gray-100">
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
                    جمع کل هزینه
                  </th>
                  <th
                    style={{ fontFamily: "CustomFont" }}
                    className="border border-gray-800 text-sm"
                  >
                    پرداخت شده
                  </th>
                  <th
                    style={{ fontFamily: "CustomFont" }}
                    className="border border-gray-800 text-sm"
                  >
                    باقی مانده
                  </th>
                </tr>
                <tr className="h-8">
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {data.rate}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {new Intl.NumberFormat("fa-IR", {
                      style: "currency",
                      currency: "IRR",
                    })
                      .format(data.totalCharge)
                      .replace("ریال", "")}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {new Intl.NumberFormat("fa-IR", {
                      style: "currency",
                      currency: "IRR",
                    })
                      .format(data.totalPaidAmount)
                      .replace("ریال", "")}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {new Intl.NumberFormat("fa-IR", {
                      style: "currency",
                      currency: "IRR",
                    })
                      .format(remainingPayable)
                      .replace("ریال", "")}
                  </td>
                </tr>
              </table>

              <table className="w-full mx-0">
                <tr
                  style={{ fontFamily: "CustomFont" }}
                  className="h-8 border border-gray-800 bg-gray-100"
                >
                  <th className="border border-gray-800 text-sm">
                    بانک محل پرداخت
                  </th>
                  <th className="border border-gray-800 text-sm">
                    نام صاحب حساب
                  </th>
                  <th className="border border-gray-800 text-sm">
                    شماره حساب
                  </th>
                  <th className="border border-gray-800 text-sm">
                    تاریخ چاپ
                  </th>
                </tr>
                <tr style={{ fontFamily: "CustomFont" }} className="h-8">
                  <td className="text-center border border-gray-800 p-1">
                    پاسارگاد
                  </td>
                  <td className="text-center border border-gray-800 p-1">
                    زرافشان ایزن
                  </td>
                  <td className="text-center border border-gray-800 p-1">
                    603799178800
                  </td>
                  <td className="text-center border border-gray-800 p-1">
                    {new Date().toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              </table>

              <div className="flex flex-row flex-1 w-full gap-1">
                <div
                  style={{ fontFamily: "CustomFont" }}
                  className="flex flex-col gap-1 flex-[.5]"
                >
                  <div className="border border-gray-800 p-1 pb-2">
                    مهلت پرداخت
                    <p className="text-center text-xl">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("fa-IR")}
                    </p>
                    <p>مهلت داده شده شامل بدهی نمیشود</p>
                  </div>
                  <div className="border border-gray-800 p-1 pb-2 bg-gray-100">
                    مبلغ قابل پرداخت
                    <br />
                    <p className="text-center text-2xl">
                      {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      })
                        .format(remainingPayable > 0 ? remainingPayable : 0)
                        .replace("ریال", "")}
                    </p>
                  </div>
                </div>
                <div
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 flex flex-col flex-1 p-1"
                >
                  <div className="flex flex-1 flex-col justify-start">
                    <p>
                      پرداخت به صورت غیر حضوری توسط سامانه
                      https://persiangulfmall.com
                    </p>
                    <p>
                      و یا از طریق وب کیوسک مستقر در مدیریت بازار اقدام نمایید
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChargeCalculationFish.displayName = "ChargeCalculationFish";

export default ChargeCalculationFish; 