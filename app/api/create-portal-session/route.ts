import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    // Get the current user session
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the customer from the database
    const customer = await prisma.customer.findUnique({
      where: { id: session.user.id },
    });
    
    if (!customer || !customer.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Customer not found or no Stripe account linked' },
        { status: 404 }
      );
    }
    
    // Create a Stripe portal session
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard`;
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: returnUrl,
    });
    
    // Return the URL for the customer to be redirected to
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe portal session' },
      { status: 500 }
    );
  }
} 