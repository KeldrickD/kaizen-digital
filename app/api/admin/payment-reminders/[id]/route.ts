import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  
  // Just return a success response for now
  return NextResponse.json({ success: true, id });
} 