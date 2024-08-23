import { NextRequest, NextResponse } from 'next/server';

let postedData: any = null;

export async function POST(req: NextRequest) {
  const data = await req.json();
  postedData = data;
  return NextResponse.json({ message: 'Data received' });
}

export async function GET() {
  return NextResponse.json({ data: postedData });
}
