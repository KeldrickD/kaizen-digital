import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const reminder = await prisma.paymentReminder.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error updating payment reminder:', error);
    return NextResponse.json(
      { error: 'Failed to update payment reminder' },
      { status: 500 }
    );
  }
} 