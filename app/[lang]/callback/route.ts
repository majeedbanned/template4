import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/prismadb1";

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("Received POST request");

  const contentType: string = req.headers.get("content-type") || "";
  console.log("Content-Type:", contentType);
  let endResult = "خطا در تراکنش";
  try {
    let data: Record<string, any> | null = null;

    if (contentType.includes("application/json")) {
      const rawBody: string = await req.text();
      console.log("Raw body:", rawBody);
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

    if (data?.respcode === "0") {
      let newObject = {
        onlineAmount: data.amount,
        cardnumber: data.cardnumber,
        rrn: data.rrn,
        tracenumber: data.tracenumber,
        digitalreceipt: data.digitalreceipt,
        datepaid: data.datepaid,
        respcode: data.respcode,
        respmsg: data.respmsg,
      };
      const response = await client.new_account.update({
        where: {
          id: Number(data?.invoiceid),
        },
        data: newObject,
      });

      const apiUrl = "https://sepehr.shaparak.ir:8081/V1/PeymentApi/Advice";
      const postData = {
        digitalreceipt: data.digitalreceipt,
        terminalid: data.terminalid,
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
          settele_Status: apiResponse.Status,
          settele_ReturnId: apiResponse.ReturnId,
          settele_Message: apiResponse.Message,
        };
        const responsefinal = await client.new_account.update({
          where: {
            id: Number(data?.invoiceid),
          },
          data: newObject,
        });

        if (apiResponse.Status === "Ok") {
          endResult = "پرداخت با موفقیت انجام شد";
        } else {
          endResult = "خطا در پرداخت";
        }

        ////// changing database


        const newres = {
          paidBill: data.amount.toString().replace(/\D/g, ""),
          paidType:'پرداخت آنلاین',
          paidDate: data.datepaid,
         
        };
        const response2 = await client.new_account.update({
          where: {
            id: Number(data.invoiceid),
          },
          data: newres,
        });
        ////////////////////////

        console.log("API Response:", apiResponse);
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
              padding: 20px;
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
          <p>شماره مرجع: ${data?.rrn}</p>
          <p>شماره پیگیری: ${data?.tracenumber}</p>
        
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
      { error: "Failed to parse data" },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  console.log("Received GET request");

  const { searchParams } = new URL(req.url);
  const queryParams: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  console.log("Query parameters:", queryParams);

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

