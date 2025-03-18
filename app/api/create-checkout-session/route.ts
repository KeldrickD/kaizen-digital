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
    const { priceId, amount, packageDetails } = await request.json();
    
    // Handle custom pricing
    if (priceId === 'custom') {
      // Create a session with custom price
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Custom Website Package',
                description: `${packageDetails.pages} with ${packageDetails.features.join(', ')}${
                  packageDetails.maintenance !== 'None' 
                    ? ` and ${packageDetails.maintenance} maintenance`
                    : ''
                }`,
              },
              unit_amount: amount, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.headers.get('origin')}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get('origin')}?canceled=true`,
        metadata: {
          packageType: 'custom',
          pages: packageDetails.pages,
          features: packageDetails.features.join(','),
          maintenance: packageDetails.maintenance,
        },
      });
      
      return NextResponse.json({ id: session.id });
    }
    
    // Map the internal price ID to a Stripe price ID for predefined packages
    const stripePriceId = PRICE_MAP[priceId];
    
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }
    
    // Create Checkout Sessions for predefined packages
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
    console.error('Checkout session error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
} 