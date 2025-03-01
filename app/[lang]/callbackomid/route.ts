import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/prismadb1";

function formatJalaliDateAndTime(dateString: string) {
  const date = dateString.substring(0, 10).replace(/-/g, "/");
  const time = dateString.substring(11, 19); // Extracts "HH:MM:SS"
  return { date, time };
}

function getCurrentJalaliDateAndTime() {
  const now = new Date();
  // Use the Persian (Jalali) calendar and Latin numbering.
  const persianDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const date = persianDateFormatter.format(now); // e.g. "1403/08/25"
  // Format time as HH:MM:SS using the en-GB locale for a 24-hour clock.
  const time = now.toLocaleTimeString('en-GB'); // e.g. "13:02:13"
  return { date, time };
}


export async function POST(req: NextRequest): Promise<NextResponse> {
  //console.log("Received POST request");
  //const { date, time } = getCurrentJalaliDateAndTime();
  const contentType: string = req.headers.get("content-type") || "";
  //console.log("Content-Type:", contentType);
  let endResult = "خطا در تراکنش";
  try {
    let data: Record<string, any> | null = null;

    if (contentType.includes("application/json")) {
      const rawBody: string = await req.text();
      //console.log("Raw body:", rawBody);
      data = JSON.parse(rawBody);
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData: FormData = await req.formData();
      data = {};
      formData.forEach((value, key) => {
        data![key] = value;
      });
    } else if (contentType.includes("text/plain")) {
      const rawBody: string = await req.text();
      data = { text: rawBody };
    } else {
      return NextResponse.json(
        { error: `Unsupported content type: ${contentType}` },
        { status: 415 }
      );
    }

    console.log("Parsed data:", data);

    let apiResponse: any = null;

    if (data?.State === "OK") {
     // const { date, time } = formatJalaliDateAndTime(data.datepaid);
      const { date, time } = getCurrentJalaliDateAndTime();
      let newObject = {
        onlineAmount: data.transactionAmount,
        cardnumber: data.CardMaskPan,
       // rrn: data.ResNum,
        tracenumber: data.RefNum,
        digitalreceipt: data.TraceNo,
        //  datepaid: data.datepaid,
        datepaid: date, // Formatted date
        paidTime: time,
        respcode: data.State,
        respmsg: ""//data.respmsg,
      };
      const response = await client.new_account.update({
        where: {
          id: Number(data?.ResNum),
        },
        data: newObject,
      });

      const token=await client.new_account.findFirst({
        where: {
          id: Number(data?.ResNum),
        }
      });

      const apiUrl = "http://ref.sayancard.ir/ref-payment/RestServices/mts/verifyMerchantTrans/";
      const postData = {
        WSContext: {
          UserId: "411459444",
          Password: "843771"
        },
        RefNum: data.RefNum,
        Token: token?.rrn,
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        apiResponse = await response.json();

        let newObject = {
          settele_Status: apiResponse.Result,
          settele_ReturnId: apiResponse.Amount,
          settele_Message: apiResponse.RefNum,
        };
        const responsefinal = await client.new_account.update({
          where: {
            id: Number(data?.ResNum),
          },
          data: newObject,
        });

        if (apiResponse.Result === "erSucceed") {
          endResult = "پرداخت با موفقیت انجام شد";
        } else {
          endResult = "خطا در پرداخت";
        }

        ////// changing database
        const existedRow = await client.new_account.findFirst({
          where: {
            id: Number(data.ResNum),
          },
        });

        //check for duplicate
        if (existedRow?.paidType === "پرداخت آنلاین") {
        } else {
          const newres = {
            paidBill: data.transactionAmount.toString().replace(/\D/g, ""),
            paidType: "پرداخت آنلاین",
            // paidDate: data.datepaid,
            paidDate: date, // Formatted date
            paidTime: time,
          };

          const Secondnewres = {
            paidBill1: data.transactionAmount.toString().replace(/\D/g, ""),
            paidType: "پرداخت آنلاین",
            //paidDate1: data.datepaid,
            paidDate1: date, // Formatted date
            paidTime: time,
            paidBill:
              Number(existedRow?.paidBill) +
              Number(data.transactionAmount.toString().replace(/\D/g, "")),
          };

          let updateedrow;
          if (Number(existedRow?.paidBill) !== 0) {
            updateedrow = Secondnewres;
          } else {
            updateedrow = newres;
          }

          const response2 = await client.new_account.update({
            where: {
              id: Number(data.ResNum),
            },
            data: updateedrow,
          });
          ////////////////////////

          //console.log("API Response:", apiResponse);
        }
      } catch (error) {
        console.error("Error calling API:", error);
        return NextResponse.json(
          { error: "Failed to call API" },
          { status: 500 }
        );
      }
    }

    // Create a styled HTML response with the API result
    const htmlContent = `
      <html lang="fa" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>نتیجه تراکنش</title>
          <style>
            body {
              font-family: 'Tahoma', 'Arial', sans-serif;
              background-color: #f4f4f4;
              color: #333;
              direction: rtl;
              padding: 40px;
              line-height: 1.6;
            }
            h1 {
              color: #4CAF50;
              font-size: 24px;
            }
            p {
              font-size: 18px;
              margin-bottom: 10px;
            }
            pre {
              background-color: #eee;
              padding: 10px;
              border-radius: 5px;
            }
            a {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 15px;
              background-color: #007BFF;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            }
            a:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <h1>${endResult}</h1>
          <p>شماره مرجع: ${data?.RefNum}</p>
          <p>شماره پیگیری: ${data?.TraceNo}</p>
        
          <a href="https://charge.persiangulfmall.com/fa/admin/bill">بازگشت</a>
        </body>
      </html>
    `;

    return new NextResponse(htmlContent, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error parsing data:", error);
    return NextResponse.json(
      { error: "Failed to parse dataomid" },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  //console.log("Received GET request");

  const { searchParams } = new URL(req.url);
  const queryParams: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  //console.log("Query parameters:", queryParams);

  // Create a styled HTML response for GET requests
  const htmlContent = `
    <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>پارامترهای جستجو</title>
        <style>
          body {
            font-family: 'Tahoma', 'Arial', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            direction: rtl;
            padding: 20px;
            line-height: 1.6;
          }
          h1 {
            color: #4CAF50;
            font-size: 24px;
          }
          pre {
            background-color: #eee;
            padding: 10px;
            border-radius: 5px;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 15px;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          }
          a:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <h1>پارامترهای دریافت‌شده</h1>
        <pre>${JSON.stringify(queryParams, null, 2)}</pre>
        <a href="/">بازگشت</a>
      </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: { "Content-Type": "text/html" },
  });
}
