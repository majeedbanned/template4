// app/api/payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {

    console.log('start')

    const formData = await request.formData();
    const terminalID = formData.get('TerminalID') as string;
    const amount = formData.get('Amount') as string; // Add Amount from client form
    const invoiceID = formData.get('invoiceID') as string; // Add invoiceID from client form
    console.log('start2')

    const payload = {
      WSContext: {
            UserId: "411459444",
            Password: "843771"
          },
          TransType: "EN_GOODS",
          ReserveNum: invoiceID,
          //TerminalId: 41787085,
          MerchantId: 411459444,

      Amount: parseInt(amount, 10),
      RedirectUrl: "https://charge.persiangulfmall.com/callbackomid",
     
    };
    console.log('start3')

    const response = await fetch("https://ref.sayancard.ir/ref-payment/RestServices/mts/generateTokenWithNoSign/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log('start4')

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log('start5')

    const data = await response.json();
console.log(data)
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error submitting form" }, { status: 500 });
  }
}
