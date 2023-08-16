import React, { useRef } from "react";
import logo from "@/public/images/logo.png";
import { User2 } from "lucide-react";

type props = {
  data: any;
};
export const ComponentToPrint = React.forwardRef(({ data }: props, ref) => {
  return (
    <div style={{ display: "none" }} className="">
      <div
        //@ts-ignore
        ref={ref}
        dir="rtl"
        className="bg-white flex-col   gap-2 flex justify-center items-center rounded-lg  px-2 py-2 w-full  mx-auto mt-2"
      >
        <div className="flex w-full flex-row justify-between items-center flex-1">
          <div className=" p-2 font-bold"> قبض پرداخت شارژ ماهیانه</div>
          <div className="p-2 font-bold">مجتمع خلیج فارس</div>
        </div>
        <table className="w-full mx-4">
          <tr className="h-10 border bg-gray-100">
            <th className="border text-sm">دوره جاری</th>
            <th className="border text-sm">نام دارنده سرقفلی</th>
            <th className="border text-sm">پلاک</th>
            <th className="border text-sm">موقعیت</th>
          </tr>
          <tr className="h-10 ">
            <td className=" text-center border p-2">
              {data?.month?.toString()}
            </td>
            <td className="  text-center border p-2">محمد حسنی</td>
            <td className=" text-center border p-2">{data?.pelak}</td>
            <td className=" text-center border p-2">بازار ۲</td>
          </tr>
        </table>

        <table className="w-full mx-2">
          <tr className="h-10 border  bg-gray-100">
            <th className="border text-sm"> متراژ</th>
            <th className="border text-sm">مبلغ شارژ هر متر مربع</th>
            <th className="border text-sm">مبلغ شارژ این دوره</th>
            <th className="border text-sm">دوره بدهی</th>
            <th className="border text-sm">بدهی قبلی</th>
            <th className="border text-sm"> دیرکرد</th>
          </tr>
          <tr className="h-10 ">
            <td className=" text-center border p-2">
              {data?.month?.toString()}
            </td>
            <td className="  text-center border p-2">۱۷۸ </td>
            <td className=" text-center border p-2">۱۲۴۰۰۰</td>
            <td className=" text-center border p-2"> ۲۳۴۵۰۰۰</td>
            <td className=" text-center border p-2"> ۴۵۰۰۰</td>
            <td className=" text-center border p-2">۱۷۰۰۰ </td>
          </tr>
        </table>

        <table className="w-full mx-2">
          <tr className="h-10 border  bg-gray-100">
            <th className="border text-sm">بانک محل پرداخت</th>
            <th className="border text-sm">نام صاحب حساب</th>
            <th className="border text-sm">شماره حساب</th>
            <th className="border text-sm">بستانکاری</th>
          </tr>
          <tr className="h-10 ">
            <td className=" text-center border p-2">پاسارگاد</td>
            <td className="  text-center border p-2">محمد حسنی</td>
            <td className=" text-center border p-2">۲۳۴۶۳۵۴۳</td>
            <td className=" text-center border p-2"> ۰</td>
          </tr>
        </table>

        <div className="flex flex-row flex-1 w-full gap-2  h-[400px]">
          <div className="flex flex-col gap-2 flex-[.5] ">
            <div className="border p-2 pb-8 ">
              مهلت پرداخت
              <br />
              <p className="text-center text-xl">۱۴۰۲/۰۳/۰۲</p>
            </div>
            <div className="border p-2 pb-8  bg-gray-100">
              مبلغ قابل پرداخت
              <br />
              <p className="text-center text-2xl ">۲۳۴۵۰۰۰۰</p>
            </div>
          </div>
          <div className="border flex-1 p-2">بدون ثبت ماشینی اعتبار ندارد</div>
        </div>
        {/* <img src={logo} alt="" className="w-10 h-10 rounded-md" />
        <User2 className="w-10 h-10"></User2> */}
        {/* <h1 className="font-bold text-2xl my-4 text-center text-blue-600"></h1>
        <hr className="mb-2" />
        <div className="flex justify-between mb-6">
          <h1 className="text-lg font-bold">Invoice</h1>
          <div className="text-gray-700">
            <div>Date: {data?.month}</div>
            <div>Invoice #: 4444</div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Bill To:</h2>
          <div className="text-gray-700 mb-2">John Doe</div>
          <div className="text-gray-700 mb-2">123 Main St.</div>
          <div className="text-gray-700 mb-2">Anytown, USA 12345</div>
          <div className="text-gray-700">johndoe@example.com</div>
        </div>
        <table className="w-full mb-8">
          <thead>
            <tr>
              <th className="text-left font-bold text-gray-700">Description</th>
              <th className="text-right font-bold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-left text-gray-700">Product 1</td>
              <td className="text-right text-gray-700">$100.00</td>
            </tr>
            <tr>
              <td className="text-left text-gray-700">Product 2</td>
              <td className="text-right text-gray-700">$50.00</td>
            </tr>
            <tr>
              <td className="text-left text-gray-700">Product 3</td>
              <td className="text-right text-gray-700">$75.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="text-left font-bold text-gray-700">Total</td>
              <td className="text-right font-bold text-gray-700">$225.00</td>
            </tr>
          </tfoot>
        </table>
        <div className="text-gray-700 mb-2">Thank you for your business!</div>
        <div className="text-gray-700 text-sm">
          Please remit payment within 30 days.
        </div> */}
      </div>
    </div>
  );
});
ComponentToPrint.displayName = "MyComponent";

export default ComponentToPrint;
