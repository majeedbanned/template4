import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('Received POST request');

    // Parse the incoming request's JSON body
    const data = await req.json();
    console.log(data);

    // Return the parsed data as JSON in the response
    return NextResponse.json({ receivedData: data });
  } catch (error) {
    // Handle any errors that occur during parsing or processing
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
