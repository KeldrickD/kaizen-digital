import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Get the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Redirect to Stripe Checkout
    if (session && session.url) {
      return NextResponse.redirect(session.url);
    } else {
      // Fallback to the default redirect
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
} 