import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Define package ID types for better type safety
type PackageId = 'price_starter' | 'price_business' | 'price_elite' | 'custom';
type PaymentType = 'full' | 'deposit';

// Price information for standard packages
const PACKAGE_INFO: Record<string, {
  name: string;
  amount: number;
  description: string;
}> = {
  price_starter: {
    name: 'Starter Site',
    amount: 75000, // $750.00 in cents
    description: '3-page professional site with mobile-friendly design'
  },
  price_business: {
    name: 'Business Pro',
    amount: 150000, // $1,500.00 in cents
    description: '5-page website with lead capture form & custom branding'
  },
  price_elite: {
    name: 'Elite Custom Site',
    amount: 250000, // $2,500.00 in cents
    description: 'Fully custom design with e-commerce or interactive elements'
  }
};

// Standard deposit amount in cents ($500.00)
const DEPOSIT_AMOUNT = 50000;

export async function POST(request: Request) {
  try {
    // Get the session to check if user is authenticated
    const session = await getServerSession(authOptions);

    const { priceId, customerId, customerEmail } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get the price from Stripe
    const price = await stripe.prices.retrieve(priceId);
    
    if (!price) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Get or create the customer in Stripe
    let stripeCustomerId: string;
    
    // Use the user's information from the session if available
    const email = customerEmail || session?.user?.email;
    const userId = customerId || session?.user?.id;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Check if the customer already exists in our database
    const existingCustomer = userId
      ? await prisma.customer.findUnique({
          where: { id: userId },
        })
      : await prisma.customer.findFirst({
          where: { email },
        });

    if (existingCustomer?.stripeCustomerId) {
      // Use existing Stripe customer
      stripeCustomerId = existingCustomer.stripeCustomerId;
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email,
        name: existingCustomer?.name || 'New Customer',
      });
      
      stripeCustomerId = customer.id;
      
      // Update our database with the Stripe customer ID if the user exists
      if (existingCustomer) {
        await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: { stripeCustomerId },
        });
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Create the checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/api/webhook-success`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        userId: existingCustomer?.id || '',
      },
    });

    return NextResponse.json({ id: checkoutSession.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 