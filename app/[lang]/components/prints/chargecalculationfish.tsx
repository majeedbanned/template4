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
    editstore?: any;
  };
};

export const ChargeCalculationFish = React.forwardRef<HTMLDivElement, props>(
  // @ts-ignore
  ( { data,editstore }, ref) => {
    const remainingPayable = data.totalCharge - data.totalPaidAmount;
    console.log('>>>>>>9',editstore)
    const currentDate = new Date().toLocaleDateString("fa-IR");
    
    return (
      <div style={{ display: "none" }} className="pprint">
      <div >
        
        <div
          ref={ref}
          dir="rtl"
          className="bg-white flex-col gap-0 flex justify-center items-center border-2 w-full relative"
        >
          
          {/* Watermark */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              fontSize: '4rem',
              fontFamily: 'CustomFont',
              color: 'rgba(0, 0, 0, 0.08)',
              fontWeight: 'bold',
              transform: 'rotate(-45deg)',
              userSelect: 'none',
              zIndex: 999
            }}
          >
            اجاره سرقفلی
          </div>
          
          <div className="w-full px-2 relative">
         


            <div className="p-1 font-bold flex flex-col justify-between items-center">
                <p style={{ fontFamily: "CustomFont" }}>
                    
                    مجتمع خلیج فارس
                  </p>
                  <p style={{ fontFamily: "CustomFont" }}>
                    اجاره سرقفلی واحد های تجاری 
                    
                  </p>

                  <p style={{ fontFamily: "CustomFont" }}>
                                       صورتحساب تا دوره ۱۴۰۳ 
                  </p>
                 
                </div>

            <div className="flex flex-col justify-center w-full items-center px-2 py-0 mt-0 mx-0">
              <div className="flex w-full flex-row justify-between items-center flex-1">
              <div className="flex flex-col items-center">
              <Image src={logo} width={100} height={100} alt="Logo" className="mb-2" />
            </div>
                <div
                  style={{ fontFamily: "CustomFont" }}
                  className="p-1 font-bold"
                >
                  <div className="mb-2">تاریخ: {currentDate}</div>
                  {editstore?.id ? `شماره سریال : ${editstore?.id}` : "شماره سریال :"}
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
                    موقعیت
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
                    {editstore.name || "-"}
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
                    {editstore?.types_bazar?.bazar}-
                    {editstore?.types_rahro?.rahro}-
                    {editstore?.types_tabagh?.tabagh}

               

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
                  شماره حساب      1410/8000/13461762/15
<br/>

                    شماره شبا     Ir470570141080013461762115

 
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
                    در صورت پرداخت غیر حضوری، فیش واریزی به شماره 09014118181 در واتساب ارسال گردد.
                    
                              </p>
<br/>
<br/>



                   
                  </div>
                </div>
              </div>
            </div>
          </div>



          <strong style={{ fontFamily: "CustomFont" }} className="text-right w-full pr-4 ">دارنده سرقفلی بر اساس بند الف ماده هفت قرار داد وا گذاری سرقفلی ،  موظف به پرداخت اجاره بها میباشد    
</strong>

        </div>

      </div>
      
                   
        
        </div>
    );
  }
);

ChargeCalculationFish.displayName = "ChargeCalculationFish";

export default ChargeCalculationFish; 