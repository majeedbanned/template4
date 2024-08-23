// app/api/payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const terminalID = formData.get('TerminalID') as string;
    const amount = formData.get('Amount') as string; // Add Amount from client form
    const invoiceID = formData.get('invoiceID') as string; // Add invoiceID from client form

    const payload = {
      Amount: parseInt(amount, 10),
      callbackURL: "https://charge.persiangulfmall.com/callback",
      invoiceID: invoiceID,
      terminalID: parseInt("98780551", 10),
    };

    const response = await fetch("https://sepehr.shaparak.ir:8081/V1/PeymentApi/GetToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error submitting form" }, { status: 500 });
  }
}
