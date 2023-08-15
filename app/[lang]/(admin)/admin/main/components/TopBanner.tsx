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
    <div className="flex flex-col gap-8 mt-8">
      {/* <div className="flex flex-row gap-8 ">
        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#fb8b86] shadow-lg shadow-[#fead92]/50 to-[#fead92] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div
            className="absolute bottom-1 right-1 w-[70px] h-[70px] rounded-l-3xl 
        rounded-tl-[105px] 
        rounded-tr-[85px]
        rounded-br-[115px]
        rounded-bl-[95px]


         bg-white/40"
          ></div>

          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#6d7fe5] shadow-lg shadow-[#6d7fe5]/50 to-[#6066de] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={2}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#fd83aa] shadow-lg shadow-[#fd83aa]/50 to-[#ff548a] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#45a6e6] shadow-lg shadow-[#45a6e6]/50 to-[#1d8fdb] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>
      </div> */}

      <div className="grid h-48 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        {/* <div className="w-[170px] h-[200px] rounded-3xl shadow-slate-200 shadow-lg flex justify-center flex-col gap-4 items-center">
          <div
            className=" w-[90px] h-[90px] rounded-l-3xl bg-[#fff8ec]
                  rounded-tl-[125px] 
                  rounded-tr-[165px]
                 rounded-br-[135px]
                 rounded-bl-[115px]
                 flex justify-center items-center
        "
          >
            <AcademicCapIcon className="w-10 h-10 text-[#ffb52c]"></AcademicCapIcon>
          </div>
          <span className="text-[#ffa600]">اطلاعات واحد</span>
        </div> */}

        {/* <div className="w-[170px] h-[200px] rounded-3xl shadow-slate-200 shadow-lg flex justify-center flex-col gap-4 items-center">
          <div
            className=" w-[90px] h-[90px] rounded-l-3xl bg-[#ecefff]
                  rounded-tl-[105px] 
                  rounded-tr-[155px]
                 rounded-br-[115px]
                 rounded-bl-[135px]
                 flex justify-center items-center
        "
          >
            <AcademicCapIcon className="w-10 h-10 text-[#6541f6]"></AcademicCapIcon>
          </div>

          <span className="text-[#6541f6]">اطلاعات واحد</span>
        </div> */}

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
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="64"
              height="72"
              viewBox="27 21 64 72"
            >
              <defs>
                <path d="M60.9784821 18.4748913L60.9784821 0.0299638385 0.538377293 0.0299638385 0.538377293 18.4748913z"></path>
              </defs>
              <g
                fill="none"
                fillRule="evenodd"
                stroke="none"
                strokeWidth="1"
                transform="translate(27 21)"
              >
                <g>
                  <g transform="translate(2.262 21.615)">
                    <path
                      fill="#59A785"
                      d="M7.178 18.475h47.16c3.653 0 6.641-2.748 6.641-6.107V6.137c0-3.359-2.988-6.107-6.64-6.107H7.178C3.526.03.538 2.778.538 6.137v6.231c0 3.359 2.988 6.107 6.64 6.107"
                      mask="url(#mask-2)"
                    ></path>
                  </g>
                  <path
                    fill="#FFF"
                    d="M62.0618351 55.9613216L7.2111488 60.3692832 1.50838775 5.79374073 56.3582257 1.38577917z"
                    transform="rotate(-2 31.785 30.878)"
                  ></path>
                  <ellipse
                    cx="30.058"
                    cy="21.766"
                    fill="#25D48A"
                    opacity="0.216"
                    rx="9.952"
                    ry="9.173"
                  ></ellipse>
                  <g fill="#54C796" transform="translate(16.96 6.48)">
                    <path d="M10.7955395 21.7823628L0.11873799 11.3001058 4.25482787 7.73131106 11.0226557 14.3753897 27.414824 1.77635684e-15 31.3261391 3.77891399z"></path>
                  </g>
                  <path
                    fill="#59B08B"
                    d="M4.823 67.437h56.395c1.112 0 2.023-.837 2.023-1.86v-34.19c0-1.023-.91-1.86-2.023-1.86H4.823c-1.112 0-2.022.837-2.022 1.86v34.19c0 1.023.91 1.86 2.022 1.86"
                  ></path>
                  <path
                    fill="#4FC391"
                    d="M33.334 67.437h27.884c1.112 0 2.023-.837 2.023-1.86v-34.19c0-1.023-.91-1.86-2.023-1.86H33.334c-1.112 0-2.023.837-2.023 1.86v34.19c0 1.023.91 1.86 2.023 1.86"
                  ></path>
                  <path
                    fill="#FEFEFE"
                    d="M29.428 33.264c0 .956.843 1.731 1.883 1.731s1.882-.775 1.882-1.73c0-.957-.843-1.732-1.882-1.732-1.04 0-1.883.775-1.883 1.731"
                  ></path>
                  <path
                    fill="#5BD6A2"
                    d="M8.454 71.555h49.134c3.109 0 5.653-2.34 5.653-5.2 0-2.86-2.544-5.2-5.653-5.2H8.454c-3.11 0-5.653 2.34-5.653 5.2 0 2.86 2.544 5.2 5.653 5.2"
                  ></path>
                </g>
              </g>
            </svg> */}
            <UserIcon
              fontSize={20}
              className={`
                    w-12 h-12 dark:text-white text-green-500  hover:text-green-400`}
            ></UserIcon>
          </div>
          <p className="text-green-400">اطلاعات مالکین</p>
        </Link>
        <Link className="card human-resources" href={"/admin/tenant/all"}>
          <div className="card wallet">
            <div className="overlay"></div>
            <div className="circle">
              <BuildingStorefrontIcon
                fontSize={20}
                className={`
                    w-12 h-12 dark:text-white text-purple-500  hover:text-purple-400`}
              ></BuildingStorefrontIcon>
            </div>
            <p className="text-purple-500">اطلاعات مستاجرین</p>
          </div>
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
