import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Received POST request');

  // Check if the Content-Type is application/json
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type, expected application/json' }, { status: 400 });
  }

  try {
    // Read the raw body (for debugging purposes)
    const rawBody = await req.text();
    console.log('Raw body:', rawBody);

    // Parse the incoming request's JSON body
    const data = JSON.parse(rawBody);
    console.log('Parsed data:', data);

    // Return the parsed data as JSON in the response
    return NextResponse.json({ receivedData: data });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    // Handle any errors that occur during parsing or processing
    return NextResponse.json({ error: 'Failed to parse JSON' }, { status: 400 });
  }
}
