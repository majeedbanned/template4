"use client";
//@ts-ignore
import moment from "moment-jalaali";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer, Receipt } from "lucide-react";
import ChargeCalculationPrint from "@/app/[lang]/components/prints/chargecalculation";
import ChargeCalculationFish from "@/app/[lang]/components/prints/chargecalculationfish";

interface ChargeCalculationProps {
  startDate: string; // e.g. "۱۳۹۱/۰۲/۰۳" or "1391/02/03"
  rate: number; // e.g. 27.9
  totalPaidAmount?: number; // total amount paid so far
  pelak?: string; // pelak number for printing
}

interface YearLog {
  year: number;
  monthsCharged: number;
  formula: string;
  charge: number;
}

// helper to convert Persian digits to Latin digits
const toLatinDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

export default function ChargeCalculation({
  startDate,
  rate,
  totalPaidAmount = 0,
  pelak,
}: ChargeCalculationProps) {
  moment.loadPersian({ usePersianDigits: false }); // keep internal digits Latin

  const printRef = useRef(null);
  const fishPrintRef = useRef(null);
  
  const latinDate = toLatinDigits(startDate.trim());
  const start = moment(latinDate, "jYYYY/jMM/jDD", true); // strict parse

  if (!start.isValid()) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md my-6">
        ⚠️ تاریخ شروع نامعتبر است
      </div>
    );
  }

  const today = moment();
  const logs: YearLog[] = [];

  const START_YEAR_3 = 3;
  const THRESHOLD_YEAR = 1402;

  let totalCharge = 0;
  const startYear = start.jYear();
  const endYear = today.jYear();

  for (let year = startYear; year <= endYear; year++) {
    const isFirstYear = year === startYear;
    const isLastYear = year === endYear;

    let monthsInYear = 12;
    if (isFirstYear) monthsInYear = 12 - start.jMonth();
    if (isLastYear) monthsInYear = today.jMonth() + 1;

    let yearlyCharge = 0;
    let formula = "";

    if (year - startYear < START_YEAR_3) {
      yearlyCharge = rate * monthsInYear * 3000;
      formula = `${rate} × ${monthsInYear} × 3000`;
    } else if (year < THRESHOLD_YEAR) {
      yearlyCharge = rate * 12 * 10000;
      formula = `${rate} × 12 × 10000`;
    } else {
      yearlyCharge = rate * monthsInYear * 100000;
      formula = `${rate} × ${monthsInYear} × 100000`;
    }

    logs.push({
      year,
      monthsCharged: monthsInYear,
      formula,
      charge: yearlyCharge,
    });
    totalCharge += yearlyCharge;
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `گزارش_محاسبه_هزینه_${pelak || 'unknown'}_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '_')}`,
  });

  const handleFishPrint = useReactToPrint({
    content: () => fishPrintRef.current,
    documentTitle: `فیش_سرقفلی_${pelak || 'unknown'}_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '_')}`,
  });

  const printData = {
    startDate,
    rate,
    totalCharge,
    totalPaidAmount,
    logs,
    pelak,
  };

  const fishData = {
    startDate,
    rate,
    totalCharge,
    totalPaidAmount,
    pelak,
  };

  return (
    <div className="p-4 bg-white shadow rounded-md my-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">📊 محاسبه هزینه</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleFishPrint}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            چاپ فیش
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            چاپ گزارش کامل
          </Button>
        </div>
      </div>
      <p>📅 تاریخ دعوت نامه: {startDate}</p>
      <p>💸 متراژ: {rate}</p>

      <table className="mt-4 w-full border text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">سال</th>
            <th className="border px-2 py-1">تعداد ماه</th>
            <th className="border px-2 py-1">فرمول</th>
            <th className="border px-2 py-1">هزینه</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.year}>
              <td className="border px-2 py-1">{log.year}</td>
              <td className="border px-2 py-1">{log.monthsCharged}</td>
              <td className="border px-2 py-1">{log.formula}</td>
              <td className="border px-2 py-1">
                {log.charge.toLocaleString("fa-IR")} ریال
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-4 text-md font-bold text-green-600">
        💰 جمع کل: {totalCharge.toLocaleString("fa-IR")} ریال
      </h3>
      
      {totalPaidAmount > 0 && (
        <>
          <h3 className="mt-2 text-md font-bold text-blue-600">
            💳 مجموع پرداخت‌ها: {totalPaidAmount.toLocaleString("fa-IR")} ریال
          </h3>
          <h3 className="mt-2 text-md font-bold text-red-600">
            🔴 مانده قابل پرداخت: {(totalCharge - totalPaidAmount).toLocaleString("fa-IR")} ریال
                     </h3>
         </>
       )}
       
      {/* Hidden print components */}
      <ChargeCalculationPrint ref={printRef} data={printData} />
      <ChargeCalculationFish ref={fishPrintRef} data={fishData} />
    </div>
  );
}
