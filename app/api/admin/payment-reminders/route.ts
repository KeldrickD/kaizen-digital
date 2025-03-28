import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reminders = await prisma.paymentReminder.findMany({
      orderBy: {
        scheduledFor: 'asc',
      },
      where: {
        status: 'pending',
      },
      take: 50, // Limit to next 50 pending reminders
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching payment reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment reminders' },
      { status: 500 }
    );
  }
} 