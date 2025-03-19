import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { maintenancePlans, getPlanById } from '@/app/data/subscriptionPlans';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

// Map of plan IDs to Stripe price IDs - you should replace these with your actual Stripe price IDs
const PLAN_TO_STRIPE_PRICE_ID: Record<string, string> = {
  'basic-monthly': process.env.STRIPE_BASIC_PRICE_ID || 'price_XXXXXXXXXX',
  'growth-monthly': process.env.STRIPE_GROWTH_PRICE_ID || 'price_XXXXXXXXXX',
  'elite-monthly': process.env.STRIPE_ELITE_PRICE_ID || 'price_XXXXXXXXXX'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, customerEmail, customerName, companyName, website } = body;

    // Validate required fields
    if (!planId || !customerEmail || !customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get plan details
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Get the Stripe Price ID for this plan
    const stripePriceId = PLAN_TO_STRIPE_PRICE_ID[planId];
    if (!stripePriceId) {
      return NextResponse.json({ error: 'Plan configuration error' }, { status: 500 });
    }

    // Create a Stripe Checkout Session for the subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: customerEmail,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 30, // First month free
        metadata: {
          planId,
          planName: plan.name,
        },
      },
      metadata: {
        planId,
        planName: plan.name,
        customerName,
        companyName: companyName || '',
        website: website || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/webhook-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/maintenance`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating subscription checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 