import React, { useRef } from "react";
import logo from "@/public/images/logofull.png";
import { QRCodeSVG } from "qrcode.react";
import { Store, User2 } from "lucide-react";
import "./custom-font.css";
import Image from "next/image";
import { type } from "os";
type props = {
  data: any;
  type: string;
  // store: any;
  // chargeDef: any;
};
export const ComponentToPrint = React.forwardRef(
  ({ data, type }: props, ref) => {
    //alert(type);
    const ll = data?.length;
    return (
      <div style={{ display: "none" }} className="pprint ">
        <div
          //@ts-ignore
          ref={ref}
          dir="rtl"
          className="bg-white flex-col  p-4  gap-0 flex justify-center items-center border-2
        w-full  "
        >
          <table className="w-full max-w-screen-lg mx-auto  p-4">
            <thead>
              <tr>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="break-normal border border-gray-500 p-1"
                >
                  ردیف
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="break-normal border border-gray-500 p-1"
                >
                  پلاک
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border  border-gray-500 p-1"
                >
                  نوع
                </th>
                {type === "standard" && (
                  <th
                    style={{ fontFamily: "CustomFont" }}
                    className="border  border-gray-500 p-1"
                  >
                    نام
                  </th>
                )}
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border  border-gray-500 p-1"
                >
                  وضعیت
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border  border-gray-500 p-1"
                >
                  دوره
                </th>
                {type === "standard" && (
                  <th
                    style={{ fontFamily: "CustomFont" }}
                    className="border break-normal border-gray-500 p-1"
                  >
                    قابل پرداخت
                  </th>
                )}
                {type === "standard" && (
                  <th
                    style={{ fontFamily: "CustomFont" }}
                    className="border  border-gray-500 p-1"
                  >
                    پرداخت شده
                  </th>
                )}

                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border  border-gray-500 p-1"
                >
                  تاریخ
                </th>

                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border  border-gray-500 p-1"
                >
                  دوره بدهی
                </th>
                <th
                  style={{ fontFamily: "CustomFont" }}
                  className="border  border-gray-500 p-1"
                >
                  موقعیت
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {data?.length > 1 && <div className="pagebreak"></div>} */}
              {data?.map((item: any, index: any) => (
                <tr className="border" key={index}>
                  <td
                    style={{ fontFamily: "CustomFont", whiteSpace: "nowrap" }}
                    className="border  text-sm  border-gray-500 p-1"
                  >
                    {index}
                  </td>

                  <td
                    style={{ fontFamily: "CustomFont", whiteSpace: "nowrap" }}
                    className="border  text-sm  border-gray-500 p-1"
                  >
                    {item.pelak}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="border text-sm border-gray-500 p-1"
                  >
                    {item.nov}
                  </td>
                  {type === "standard" && (
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className="border text-sm border-gray-500 p-1"
                    >
                      {item.name.toString().trim()}
                    </td>
                  )}
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="border text-sm border-gray-500 p-1"
                  >
                    {item.active.toString() === "true" ? "فعال" : "غیر فعال"}
                  </td>
                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="border whitespace-nowrap break-normal text-sm border-gray-500 p-1"
                  >
                    {item.month}
                  </td>
                  {type === "standard" && (
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className="border text-sm border-gray-500 p-1"
                    >
                      {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      }).format(item.TotalBill)}
                      {/* {item.TotalBill} */}
                    </td>
                  )}

                  {type === "standard" && (
                    <td
                      style={{ fontFamily: "CustomFont" }}
                      className="border text-sm border-gray-500 p-1"
                    >
                      {/* {item.paidBill} */}

                      {new Intl.NumberFormat("fa-IR", {
                        style: "currency",
                        currency: "IRR",
                      }).format(item.paidBill)}
                    </td>
                  )}

                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="border  text-sm border-gray-500 p-1"
                  >
                    {item.paidDate}
                  </td>

                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="border  text-sm border-gray-500 p-1"
                  >
                    {item.deptPeriod}
                  </td>

                  <td
                    style={{ fontFamily: "CustomFont" }}
                    className="border whitespace-nowrap text-[10px] border-gray-500 p-1"
                  >
                    {item.bazar + "-" + item.tabagh + "-" + item.rahro}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
);
ComponentToPrint.displayName = "MyComponent";

export default ComponentToPrint;
