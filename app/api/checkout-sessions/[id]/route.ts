import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

// GET handler for retrieving a specific checkout session by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ['payment_intent']
    });
    
    // Extract the important details we need
    const paymentDetails = {
      id: session.id,
      status: session.status,
      paymentType: session.metadata?.paymentType || 'full',
      totalAmount: session.metadata?.totalAmount,
      remainingAmount: session.metadata?.remainingAmount,
      packageType: session.metadata?.packageType,
      customer: session.customer,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      paymentStatus: session.payment_status,
    };
    
    return NextResponse.json(paymentDetails);
  } catch (err: any) {
    console.error('Error retrieving checkout session:', err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
} 