import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ reminders: [] });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 