// app/[lang]/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const contentType = req.headers.get('content-type') || '';
    let data: Record<string, any> | null = null;

    if (contentType.includes('application/json')) {
      const rawBody = await req.text();
      data = JSON.parse(rawBody);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      data = {};
      formData.forEach((value, key) => {
        data![key] = value;
      });
    } else if (contentType.includes('text/plain')) {
      const rawBody = await req.text();
      data = { text: rawBody };
    } else {
      return NextResponse.json({ error: `Unsupported content type: ${contentType}` }, { status: 415 });
    }

    return NextResponse.redirect(`/callback?data=${encodeURIComponent(JSON.stringify(data))}`);
  } catch (error) {
    console.error('Error parsing data:', error);
    return NextResponse.json({ error: 'Failed to parse data' }, { status: 400 });
  }
}
