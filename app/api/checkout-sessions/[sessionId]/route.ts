import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(
  request: Request,
  context: { params: { sessionId: string } }
) {
  try {
    const sessionId = context.params.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // First check if this is in our database (for payment links)
    try {
      const url = new URL('/api/payments/store', request.url);
      url.searchParams.append('id', sessionId);
      
      const response = await fetch(url.toString());
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Found in our database
          const payment = data[0];
          return NextResponse.json({
            id: payment.id,
            paymentType: payment.paymentType,
            status: payment.status,
            amount: payment.amount,
            remainingAmount: payment.remainingAmount,
            customerEmail: payment.customerEmail,
            customerName: payment.customerName,
            packageType: payment.packageType,
            description: payment.description,
          });
        }
      }
    } catch (error) {
      console.error('Error checking payment database:', error);
      // Continue to check Stripe directly
    }

    // Check Stripe directly
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      paymentType: session.metadata?.paymentType || 'full',
      status: session.payment_status,
      amount: session.amount_total,
      remainingAmount: session.metadata?.remainingAmount || '0', 
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      packageType: session.metadata?.packageType,
      description: session.metadata?.packageDescription,
    });
  } catch (error: any) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve checkout session' },
      { status: 500 }
    );
  }
} 