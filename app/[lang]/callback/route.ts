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

    // Construct absolute URL for redirection
    const { protocol, host } = new URL(req.url);
    const absoluteUrl = `${protocol}//${host}/fa/gresult?data=${encodeURIComponent(JSON.stringify(data))}`;

    return NextResponse.redirect(absoluteUrl);
  } catch (error) {
    console.error('Error parsing data:', error);
    return NextResponse.json({ error: 'Failed to parse data' }, { status: 400 });
  }
}
