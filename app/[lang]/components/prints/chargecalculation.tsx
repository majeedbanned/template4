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
    logs: Array<{
      year: number;
      monthsCharged: number;
      formula: string;
      charge: number;
    }>;
    pelak?: string;
    name?: string;
  };
};

export const ChargeCalculationPrint = React.forwardRef<HTMLDivElement, props>(
  ({ data }, ref) => {
    const remainingPayable = data.totalCharge - data.totalPaidAmount;
    
    return (
      <div style={{ display: "none" }} className="pprint">
        <div
          ref={ref}
          dir="rtl"
          className="bg-white flex-col gap-2 flex justify-center items-center px-4 py-4 mt-2 mx-4"
        >
          {/* Header */}
          <div className="flex w-full flex-row justify-between items-center flex-1 mb-4">
            <div className="p-2 font-bold">
              <p style={{ fontFamily: "CustomFont" }}>
                گزارش محاسبه هزینه سرقفلی
              </p>
            </div>
            <div style={{ fontFamily: "CustomFont" }} className="p-2 font-bold">
              مجتمع خلیج فارس
            </div>
          </div>

          {/* Basic Info */}
          <table className="w-full mx-0 mb-4">
            <thead>
              <tr className="h-10 border border-gray-800 bg-gray-100">
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
                  متراژ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10">
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
                  {data.rate}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Calculation Details */}
          <table className="w-full mx-0 mb-4">
            <thead>
              <tr className="h-10 border border-gray-800 bg-gray-100">
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-sm"
                >
                  سال
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-sm"
                >
                  تعداد ماه
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-sm"
                >
                  فرمول محاسبه
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-sm"
                >
                  مبلغ (ریال)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.logs.map((log, index) => (
                <tr key={index} className="h-10">
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {log.year}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {log.monthsCharged}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {log.formula}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="text-center border border-gray-800 p-1"
                  >
                    {log.charge.toLocaleString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <table className="w-full mx-0">
            <thead>
              <tr className="h-10 border border-gray-800 bg-gray-100">
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
                  مجموع پرداخت‌ها
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border border-gray-800 text-sm"
                >
                  مانده قابل پرداخت
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-12">
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="text-center border border-gray-800 p-1 font-bold text-green-600"
                >
                  {data.totalCharge.toLocaleString("fa-IR")} ریال
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="text-center border border-gray-800 p-1 font-bold text-blue-600"
                >
                  {data.totalPaidAmount.toLocaleString("fa-IR")} ریال
                </td>
                <td
                  style={{ fontFamily: "CustomFont" }}
                  className="text-center border border-gray-800 p-1 font-bold text-red-600"
                >
                  {remainingPayable.toLocaleString("fa-IR")} ریال
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex flex-row justify-between items-center w-full mt-6">
            <div
              style={{ fontFamily: "CustomFont" }}
              className="text-sm text-gray-600"
            >
              تاریخ چاپ: {new Date().toLocaleDateString("fa-IR")}
            </div>
            <div className="flex flex-col items-center">
              <p style={{ fontFamily: "CustomFont" }} className="text-sm mb-2">
                پرداخت آنلاین
              </p>
              <QRCodeSVG size={60} value="https://persiangulfmall.com" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChargeCalculationPrint.displayName = "ChargeCalculationPrint";

export default ChargeCalculationPrint; 