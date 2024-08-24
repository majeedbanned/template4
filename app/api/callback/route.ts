import { NextRequest, NextResponse } from 'next/server';

let postedData: any = null;

export async function POST(req: NextRequest) {
  console.log("POST Request Processing Time");
  try {
    const data = await req.json();
    postedData = data;
     console.log(data);
    return NextResponse.json({ message: 'Data received' });
  } catch (error) {
    // console.error("Error processing POST request:", error);
    // console.timeEnd("POST Request Processing Time");
    return NextResponse.json({ message: 'Error receiving data' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ data: postedData });
}
