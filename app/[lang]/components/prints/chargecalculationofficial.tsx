import React from "react";
import logo from "@/public/images/logofull.png";
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

export const ChargeCalculationOfficial = React.forwardRef<HTMLDivElement, props>(
  ({ data }, ref) => {
    const remainingPayable = data.totalCharge - data.totalPaidAmount;
    const currentDate = new Date().toLocaleDateString("fa-IR");
    const receiptNumber = Math.floor(Math.random() * 9999) + 1000; // Generate random receipt number
    
    return (
      <div style={{ display: "none" }} className="pprint">
        <div
          ref={ref}
          dir="rtl"
          className="bg-white flex-col gap-2 flex justify-center items-center px-4 py-6 mt-2 mx-4 min-h-screen"
        >
          {/* Header */}
          <div className="flex w-full flex-row justify-between items-center mb-6">
            <div className="flex flex-col items-center">
              <h1 style={{ fontFamily: "CustomFont" }} className="text-2xl font-bold mb-2">
                مجتمع خلیج فارس
              </h1>
              <h2 style={{ fontFamily: "CustomFont" }} className="text-lg font-semibold">
                اجاره سرقفلی واحدهای تجاری
              </h2>
            </div>
            <div className="flex flex-col items-center">
              <Image src={logo} width={80} height={80} alt="Logo" className="mb-2" />
            </div>
          </div>

          {/* Date and Receipt Number */}
          <div className="flex w-full justify-between mb-4">
            <div style={{ fontFamily: "CustomFont" }} className="text-right">
              <div className="mb-2">تاریخ: {currentDate}</div>
              <div>شماره: {receiptNumber}</div>
            </div>
          </div>

          {/* Main Information Table */}
          <table className="w-full border-2 border-gray-800 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  نام دارنده سرقفلی
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  شماره پلاک
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  متراژ
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  موقعیت
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  وضعیت پلاک
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  {data.name || "آقای شیرازی"}
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  {data.pelak || "۱۵۳۸"}
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  {data.rate}
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  تجاری ۱ بلوک ۲ راهرو ۳
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  فعال
                </td>
              </tr>
            </tbody>
          </table>

          {/* Financial Information Table */}
          <table className="w-full border-2 border-gray-800 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  دوره جاری
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  تعداد ماههای دوره شارژ اجاره سرقفلی
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  مبلغ ماهیانه
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  مبلغ کل دوره
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  ۱۴۰۴
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  ۱۲
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  {(data.totalCharge / 12).toLocaleString("fa-IR")}
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  {data.totalCharge.toLocaleString("fa-IR")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Summary */}
          <div style={{ fontFamily: "CustomFont" }} className="text-center mb-4 text-lg font-bold">
            پرداختی دوره های قبل
          </div>

          <table className="w-full border-2 border-gray-800 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  پرداختی دوره های قبل
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  جمع کل پرداختی دوره های قبل
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  پرداختی xxxxxxx
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3"
                >
                  {data.totalPaidAmount.toLocaleString("fa-IR")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Final Amount Table */}
          <table className="w-full border-2 border-gray-800 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold"
                >
                  مبلغ قابل پرداخت
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-3 font-bold w-1/2"
                >
                  بانک پاسارگاد شماره حساب: ۱۴۱۰/۸۰۰۰/۰۰۰/۰۰۰
                  <br />
                  شماره شبا: IR 55 0570 1410 1151 3461 7620 01
                  <br />
                  درگاه پرداخت اینترنتی: //////////////////////
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-center p-6 text-2xl font-bold"
                >
                  {remainingPayable.toLocaleString("fa-IR")}
                </td>
                <td className="border border-gray-800 p-3"></td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div
            style={{ fontFamily: "CustomFont" }}
            className="text-center text-sm mt-4 border-t pt-4"
          >
            دارنده سرقفلی بر اساس بند الف ماده هفت قرارداد واگذاری سرقفلی، موظف به پرداخت اجاره بها می باشد
          </div>
        </div>
      </div>
    );
  }
);

ChargeCalculationOfficial.displayName = "ChargeCalculationOfficial";

export default ChargeCalculationOfficial; 