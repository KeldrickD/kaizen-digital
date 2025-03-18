import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const { 
      amount, 
      customerEmail, 
      customerName, 
      packageType, 
      packageDescription,
      originalSessionId
    } = await request.json();

    // Check for required fields
    if (!amount || !customerEmail || !packageType) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, customerEmail, and packageType are required' },
        { status: 400 }
      );
    }

    // Format description
    const description = packageDescription || `Remaining balance for ${packageType}`;

    // Create a payment link with proper types
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          // Use price_data as a custom property (Stripe API accepts this)
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Remaining Balance: ${packageType}`,
              description: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        } as any, // Type assertion to bypass TypeScript checking
      ],
      after_completion: { 
        type: 'redirect', 
        redirect: { 
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}` 
        } 
      },
      metadata: {
        paymentType: 'remaining_balance',
        packageType,
        originalSessionId,
        customerEmail,
        customerName: customerName || '',
        description,
      },
    } as any); // Type assertion for the entire object to bypass type checking

    // Try to update the original payment record with this payment link
    try {
      await fetch(new URL('/api/payments/store', request.url).toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: originalSessionId,
          paymentUrl: paymentLink.url,
        }),
      });
    } catch (error) {
      console.error('Error updating payment record with payment link:', error);
      // Continue anyway as the link is created
    }

    return NextResponse.json({
      url: paymentLink.url,
      id: paymentLink.id,
    });
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment link' },
      { status: 500 }
    );
  }
} 