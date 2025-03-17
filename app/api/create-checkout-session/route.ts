import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

// Map the price IDs to actual Stripe price IDs
// These would be your actual Stripe price IDs in production
const PRICE_MAP: Record<string, string> = {
  price_starter: 'price_1234567890', // Replace with actual Stripe price ID
  price_business: 'price_0987654321', // Replace with actual Stripe price ID
  price_elite: 'price_1122334455',    // Replace with actual Stripe price ID
};

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();
    
    // Map the internal price ID to a Stripe price ID
    const stripePriceId = PRICE_MAP[priceId];
    
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }
    
    // Create Checkout Sessions from body params
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}?canceled=true`,
      automatic_tax: { enabled: true },
    });
    
    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
} 