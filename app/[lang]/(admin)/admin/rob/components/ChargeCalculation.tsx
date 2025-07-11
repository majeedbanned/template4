"use client";
//@ts-ignore
import moment from "moment-jalaali";
import React from "react";

interface ChargeCalculationProps {
  startDate: string; // e.g. "۱۳۹۱/۰۲/۰۳" or "1391/02/03"
  rate: number; // e.g. 27.9
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
}: ChargeCalculationProps) {
  moment.loadPersian({ usePersianDigits: false }); // keep internal digits Latin

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
  const THRESHOLD_YEAR = 1400;

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

  return (
    <div className="p-4 bg-white shadow rounded-md my-6">
      <h2 className="text-lg font-semibold mb-2">📊 محاسبه هزینه</h2>
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
    </div>
  );
}
