"use client";
import { CalculatorIcon, HomeIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  UserIcon,
  UserMinusIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
type Props = {};

const data = [
  {
    revenue: 10400,
    subscription: 240,
  },
  {
    revenue: 14405,
    subscription: 300,
  },
  {
    revenue: 9400,
    subscription: 200,
  },
  {
    revenue: 8200,
    subscription: 278,
  },
  {
    revenue: 7000,
    subscription: 189,
  },
  {
    revenue: 9600,
    subscription: 239,
  },
  {
    revenue: 11244,
    subscription: 278,
  },
  {
    revenue: 26475,
    subscription: 189,
  },
];
export default function TopBanner({}: Props) {
  const daily = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
  }).format(124340000);
  return (
    <div className="flex flex-col h-auto gap-8 mt-8">
      <div className="grid  gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* <Card className="h-40 bg-green-50 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              پرداخت های روزانه
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daily.toPersianDigits()}</div>
            <p className="text-xs text-muted-foreground"></p>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <Line
                    type="monotone"
                    strokeWidth={2}
                    dataKey="revenue"
                    activeDot={{
                      r: 6,
                      style: { fill: "var(--theme-primary)", opacity: 0.25 },
                    }}
                    style={
                      {
                        stroke: "orange",
                        // "--theme-primary": `hsl(${
                        //   theme?.cssVars[mode === "dark" ? "dark" : "light"]
                        //     .primary
                        // })`,
                      } as React.CSSProperties
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}
        {/* <Card className="h-40 bg-gradient-to-r from-[#8968ff] to-[#af98ff] border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card> */}
        {/* <Card className="h-40 bg-slate-50 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex flex-col gap-2">
              <p>واحد های فعال : ۱۶۹۹</p>
              <p>واحد های غیر فعال : ۸۷۱</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
            تصویه نشده این ماه : 
            ۸۲۳
            </div>
            <p className="text-xs text-muted-foreground">
              واحد های بدهکار : ۲۳۴
            </p>
          </CardContent>
        </Card> */}
        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="h-40 bg-slate-50 border-0 cookieCard"
        >
          <p className="cookieHeading text-lg">پرداخت های روزانه</p>
          <p className="cookieDescription text-xl">{daily.toPersianDigits()}</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                activeDot={{
                  r: 6,
                  style: { fill: "var(--theme-primary)", opacity: 0.25 },
                }}
                style={
                  {
                    stroke: "orange",
                    // "--theme-primary": `hsl(${
                    //   theme?.cssVars[mode === "dark" ? "dark" : "light"]
                    //     .primary
                    // })`,
                  } as React.CSSProperties
                }
              />
            </LineChart>
          </ResponsiveContainer>
          {/* <button className="acceptButton">Understood</button> */}
        </motion.div>

        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="cookieCard1 h-40 bg-gradient-to-r from-[#ff7f68] to-[#efa7a2] border-0 cookieCard"
        >
          <p className="cookieHeading text-lg">واحد های فعال : ۱۶۹۹</p>
          {/* <p>واحد های غیر فعال : ۸۷۱</p> */}

          <p className="cookieDescription mb-0">واحد های بدهکار : ۲۳۴</p>
          <p className="cookieDescription  ">واحد های غیر فعال : ۳۴۱</p>
          {/* <button className="acceptButton">Understood</button> */}
        </motion.div>

        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="cookieCard2 h-40 bg-gradient-to-r from-[#68bbff] to-[#a2cbef] border-0 cookieCard"
        >
          <p className="cookieHeading text-lg"> تصویه نشده این ماه </p>

          <p className="cookieDescription text-3xl">۸۳۲</p>
          <p className="cookieDescription  ">واحد های غیر فعال : ۳۴۱</p>

          {/* <button className="acceptButton">Understood</button> */}
        </motion.div>
        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="cookieCard3 h-40 bg-gradient-to-r from-[#f268ff] to-[#eaa2ef] border-0 cookieCard"
        >
          <p className="cookieHeading">گزارشات</p>
          <p className="cookieDescription">گزارشات پرداخت آنلاین</p>
          <button
            className="acceptButton self-end hover:shadow-xl bg-gradient-to-r from-[#f268ff] to-[#eaa2ef] 
          border-lg shadow rounded-lg
          "
          >
            مشاهده
          </button>
        </motion.div>
      </div>

      <div className="flex flex-row gap-4 flex-wrap">
        <Link className="card human-resources" href={"/admin/stores"}>
          <div className="overlay"></div>
          <div className="circle">
            <BanknotesIcon
              fontSize={20}
              className={`
                      w-12 h-12 dark:text-white text-blue-500  hover:text-blue-400`}
            ></BanknotesIcon>
          </div>
          <p className=" text-blue-400">مدیریت شارژ</p>
        </Link>
        <Link className="card credentialing" href={"/admin/owner/all"}>
          <div className="overlay"></div>
          <div className="circle">
            <UserIcon
              fontSize={20}
              className={`
                    w-12 h-12 dark:text-white text-green-500  hover:text-green-400`}
            ></UserIcon>
          </div>
          <p className="text-green-400">اطلاعات مالکین</p>
        </Link>
        <Link className="card human-resources" href={"/admin/tenant/all"}>
          {/* <div className="card wallet"> */}
          <div className="overlay"></div>
          <div className="circle">
            <BuildingStorefrontIcon
              fontSize={20}
              className={`
                    w-12 h-12 dark:text-white text-purple-500  hover:text-purple-400`}
            ></BuildingStorefrontIcon>
          </div>
          <p className="text-purple-500">اطلاعات مستاجرین</p>
          {/* </div> */}
        </Link>
        <div className="card fani">
          <div className="overlay"></div>
          <div className="circle">
            <WrenchScrewdriverIcon
              fontSize={20}
              className={`
                    w-12 h-12 dark:text-white text-red-400  hover:text-red-400`}
            ></WrenchScrewdriverIcon>
          </div>
          <p className="text-red-400">فنی مهندسی</p>
        </div>
        <div className="card tarif">
          <div className="overlay"></div>
          <div className="circle">
            <CalculatorIcon
              fontSize={20}
              className={`
                    w-12 h-12 dark:text-white text-yellow-500  hover:text-yellow-400`}
            ></CalculatorIcon>
          </div>
          <p className="text-yellow-400">تعرفه ها</p>
        </div>
      </div>
    </div>
  );
}
