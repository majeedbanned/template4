// app/fa/callback/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json(); // Parse the incoming JSON data
        return NextResponse.json({ receivedData: data });
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return NextResponse.json({ error: 'Invalid JSON data' }, { status: 400 });
    }
}
