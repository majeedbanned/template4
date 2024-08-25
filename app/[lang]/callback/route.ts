import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/prismadb1";

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("Received POST request");

  const contentType: string = req.headers.get("content-type") || "";
  console.log("Content-Type:", contentType);
  let endResult = "";
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

        console.log("API Response:", apiResponse);
      } catch (error) {
        console.error("Error calling API:", error);
        return NextResponse.json(
          { error: "Failed to call API" },
          { status: 500 }
        );
      }
    }

    // Create an HTML response with the API result
    const htmlContent = `
      <html>
        <head>
          <title>POST Data Result</title>
        </head>
        <body>
          <h1></h1>
  ${endResult}
          <p>ref: ${data?.rrn}</p>
          <p>tracenumber: ${data?.tracenumber}</p>

          ${data ? `<p>API Response: ${JSON.stringify(data)}</p>` : ""}
          <h1>Received Data</h1>

          ${
            apiResponse
              ? `<p>API Response: ${JSON.stringify(apiResponse)}</p>`
              : ""
          }
          <a href="/">Go Back</a>
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

  // Create an HTML response for GET requests
  const htmlContent = `
    <html>
      <head>
        <title>GET Query Parameters</title>
      </head>
      <body>
        <h1>Received Query Parameters</h1>
        <pre>${JSON.stringify(queryParams, null, 2)}</pre>
        <a href="/">Go Back</a>
      </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: { "Content-Type": "text/html" },
  });
}
