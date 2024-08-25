import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('Received POST request');

  const contentType: string = req.headers.get('content-type') || '';
  console.log('Content-Type:', contentType);

  try {
    let data: Record<string, any> | null = null;

    if (contentType.includes('application/json')) {
      const rawBody: string = await req.text();
      console.log('Raw body:', rawBody);
      data = JSON.parse(rawBody);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData: FormData = await req.formData();
      data = {};
      formData.forEach((value, key) => {
        data![key] = value;
      });
    } else if (contentType.includes('text/plain')) {
      const rawBody: string = await req.text();
      data = { text: rawBody };
    } else {
      return NextResponse.json({ error: `Unsupported content type: ${contentType}` }, { status: 415 });
    }

    console.log('Parsed data:', data);

    // Redirect to the UI page with data as a query parameter
    return NextResponse.redirect(`https://charge.persiangulfmall.com/fa/gresult/?status=success&data=${encodeURIComponent(JSON.stringify(data))}`);
  } catch (error) {
    console.error('Error parsing data:', error);
    return NextResponse.json({ error: 'Failed to parse data' }, { status: 400 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  console.log('Received GET request');

  const { searchParams } = new URL(req.url);
  const queryParams: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  console.log('Query parameters:', queryParams);

  return NextResponse.redirect(`https://charge.persiangulfmall.com/fa/gresult/?status=success&data=${encodeURIComponent(JSON.stringify(queryParams))}`);
}
