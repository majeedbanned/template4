import React, { useRef } from "react";
import logo from "@/public/images/logofull.png";
import { QRCodeSVG } from "qrcode.react";
import { Store, User2 } from "lucide-react";
import "./custom-font.css";
import Image from "next/image";
type props = {
  data: any;
  // store: any;
  // chargeDef: any;
};
export const ComponentToPrint = React.forwardRef(({ data }: props, ref) => {
  const ll = data?.length;

  // const month=data?[0]?.new_account[0]?.month;
  return (
    <div style={{ display: "none" }} className="pprint ">
      <div
        //@ts-ignore
        ref={ref}
        dir="rtl"
        className="bg-white flex-col    gap-0 flex justify-center items-center border-2
        w-full  "
      >
        {data?.map((item: any, index: any) => {
          let month_ = item?.new_account[0]?.month?.toString().split("-")[1];
          if (month_ === "01") month_ = "فروردین";
          else if (month_ === "02") month_ = "اردیبهشت";
          else if (month_ === "03") month_ = "خرداد";
          else if (month_ === "04") month_ = "تیر";
          else if (month_ === "05") month_ = "مرداد";
          else if (month_ === "06") month_ = "شهریور";
          else if (month_ === "07") month_ = "مهر";
          else if (month_ === "08") month_ = "آبان";
          else if (month_ === "09") month_ = "آذر";
          else if (month_ === "10") month_ = "دی";
          else if (month_ === "11") month_ = "بهمن";
          else if (month_ === "12") month_ = "اسفند";
          return (
            <div
              key={index}
              className="w-full px-2 "
              // className="bg-white flex-col   gap-1 flex justify-center items-center rounded-lg  px-2 py-2    mt-2 mx-4"
            >
              <div className="flex flex-col justify-center w-full items-center px-2 py-0    mt-0 mx-0">
                <div className="flex w-full flex-row justify-between items-center flex-1">
                  <div className=" p-1 font-bold">
                    <p style={{ fontFamily: "CustomFont" }}>
                      اجاره سرقفلی واحد های تجاری مجتمع خلیج فارس
                    </p>
                  </div>
                  {/* <p className="font-bold" style={{ fontFamily: "CustomFont" }}>
                    {month_}
                  </p> */}
                  <div
                    style={{ fontFamily: "CustomFont" }}
                    className="p-1 font-bold"
                  >
                    مجتمع خلیج فارس
                  </div>
                </div>
                <table className="w-full mx-0">
                  <tr className="h-8 border border-gray-800 bg-gray-100">
                    {/* <th
                      style={{ fontFamily: "CustomFont" }}
                      className="border border-gray-800 text-sm"
                    >
                      دوره جاری
                    </th> */}
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
                    <th
                      style={{ fontFamily: "CustomFont" }}
                      className="border border-gray-800 text-sm"
                    >
                      وضعیت
                    </th>
                  </tr>
                  <tr className="h-8 ">
                    {/* <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {item?.new_account[0]?.month?.toString()}
                    </td> */}
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className="  text-center border border-gray-800 p-1"
                    >
                      {item?.name}
                    </td>
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {item?.pelak}
                    </td>
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {item?.types_tabagh?.tabagh} - {item?.types_bazar?.bazar}{" "}
                      -{item?.types_rahro?.rahro}
                    </td>

                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {item?.active.toString() === "true" ? "فعال" : "غیر فعال"}
                    </td>
                  </tr>
                </table>

                <table className="w-full mx-0">
                  <tr className="h-8 border border-gray-800  bg-gray-100">
                    <th
                      style={{ fontFamily: "CustomFont" }}
                      className="border border-gray-800 text-sm"
                    >
                      متراژ
                    </th>
                    {/* <th
                      style={{ fontFamily: "CustomFont" }}
                      className="border border-gray-800 text-sm"
                    >
                      
                      اجاره هر متر مربع
                    </th>
                    <th
                      style={{ fontFamily: "CustomFont" }}
                      className="border border-gray-800 text-sm"
                    >
                      اجاره سرقفلی ماهیانه{" "}
                    </th> */}
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
                  <tr className="h-8 ">
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {item?.metraj}
                    </td>
                    {/* <td
                      style={{ fontFamily: "CustomFont" }}
                      className="  text-center border border-gray-800 p-1"
                    >
                      {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      })
                        .format(item?.new_account[0]?.basebill)
                        .replace("ریال", "")}
                    </td>
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      })
                        .format(item?.new_account[0]?.monthbill)
                        .replace("ریال", "")}
                    </td> */}
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {/* {item?.new_account[0]?.deptPeriod} */}
                    </td>
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {/* {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      })
                        .format(item?.new_account[0]?.debt)
                        .replace("ریال", "")} */}
                    </td>
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className=" text-center border border-gray-800 p-1"
                    >
                      {/* {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      })
                        .format(item?.new_account[0]?.penalty)
                        .replace("ریال", "")} */}
                    </td>
                  </tr>
                </table>

                <table className="w-full mx-0">
                  <tr
                    style={{ fontFamily: "CustomFont" }}
                    className="h-8 border border-gray-800  bg-gray-100"
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
                      بستانکاری
                    </th>
                    <th className="border border-gray-800 text-sm">تخفیف</th>
                    <th className="border border-gray-800 text-sm">
                      پرداخت شده
                    </th>
                  </tr>
                  <tr style={{ fontFamily: "CustomFont" }} className="h-8 ">
                    <td className=" text-center border border-gray-800 p-1">
                      پاسارگاد
                    </td>
                    <td className="  text-center border border-gray-800 p-1">
                      زرافشان ایزن
                    </td>
                    <td className=" text-center border border-gray-800 p-1">
                      {/* 603799178800 */}
                    </td>
                    <td className=" text-center border border-gray-800 p-1">
                      {/* {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      })
                        .format(item?.new_account[0]?.paidExtraAsset)
                        .replace("ریال", "")} */}
                    </td>

                    <td className=" text-center border border-gray-800 p-1">
                      {/* {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      })
                        .format(item?.new_account[0]?.discount)
                        .replace("ریال", "")} */}
                    </td>
                    <td className=" text-center border border-gray-800 p-1">
                      {/* {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      })
                        .format(item?.new_account[0]?.paidBill)
                        .replace("ریال", "")} */}
                    </td>
                  </tr>
                </table>

                <div className="flex flex-row flex-1 w-full gap-1  ">
                  <div
                    style={{ fontFamily: "CustomFont" }}
                    className="flex flex-col gap-1 flex-[.5] "
                  >
                    <div className="border border-gray-800 p-1 pb-2 ">
                      مهلت پرداخت
                      {/* <br /> */}
                      <p className="text-center text-xl">
                        {
                          item?.sarghofli[0]?.paydate?.toString()
                          //.replace("-", "/") + "/31"
                        }
                      </p>
                      <p>مهلت داده شده شامل بدهی نمیشود</p>
                    </div>
                    <div className="border border-gray-800 p-1 pb-2  bg-gray-100">
                      مبلغ قابل پرداخت
                      <br />
                      <p className="text-center text-2xl ">
                        {" "}
                        {new Intl.NumberFormat("fa-IR", {
                          style: "currency",
                          currency: "IRR",
                        })
                          .format(
                            item?.sarghofli[0]?.price === "0"
                              ? 0
                              : item?.sarghofli[0]?.price
                          )
                          .replace("ریال", "")}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{ fontFamily: "CustomFont" }}
                    className="border border-gray-800 flex flex-col flex-1 p-1 "
                  >
                    <div className="flex flex-1 flex-col justify-start">
                      {/* <p>بدون ثبت ماشینی اعتبار ندارد</p> */}

                      <p>
                        {item?.sarghofli[0]?.disc}
                        {/* پرداخت به صورت غیر حضوری توسط سامانه
                        https://persiangulfmall.com */}
                      </p>

                      <p>
                        {" "}
                        {item?.sarghofli[0]?.paydiscription}
                        {/* و یا از طریق وب کیوسک مستقر در مدیریت بازار اقدام نمایید
                        eeee */}
                      </p>

                      {/* {item?.ChekRol === "1" && (
                        <p className="text-7xl text-slate-700">حقــــــوقــی</p>
                      )}
                      {item?.fine3 === "1" && (
                        <p className="text-3xl text-slate-700">
                          بعلت عدم توجه به قوانین مجتمع و تغییر کاربری، مشمول
                          جریمه سه برابری شارژ شده اید
                        </p>
                      )} */}
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
                <p>{index}</p>
              </div>
              {data?.length > 1 && <div className="pagebreak"></div>}
              {/* <h1>Page 2</h1>
            <div className="pagebreak"></div>

            <h1>Page 3</h1> */}
            </div>
          );
        })}
      </div>
    </div>
  );
});
ComponentToPrint.displayName = "MyComponent";

export default ComponentToPrint;
