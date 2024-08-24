import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Received POST request');

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type, expected application/json' }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    console.log('Raw body:', rawBody);

    const data = JSON.parse(rawBody);
    console.log('Parsed data:', data);

    return NextResponse.json({ receivedData: data });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ error: 'Failed to parse JSON' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  console.log('Received GET request');

  // Get the query parameters from the request URL
  const { searchParams } = new URL(req.url);
  const queryParams = {};

  // Convert the query parameters into a JavaScript object
  searchParams.forEach((value, key) => {
  //@ts-ignore
    queryParams[key] = value;
  });

  console.log('Query parameters:', queryParams);

  // Return the query parameters as a JSON response
  return NextResponse.json({ receivedQueryParams: queryParams });
}
