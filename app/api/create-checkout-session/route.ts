import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Define package ID types for better type safety
type PackageId = 'price_starter' | 'price_business' | 'price_elite' | 'custom';
type PaymentType = 'full' | 'deposit';

// Price information for standard packages - Ensure these match the pricing page
const PACKAGE_INFO = {
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

// Standard deposit amount for each package
const DEPOSIT_AMOUNTS = {
  price_starter: 25000,  // $250
  price_business: 50000, // $500
  price_elite: 75000,    // $750
};

// Google form URL for client intake after payment
const CLIENT_INTAKE_FORM_URL = 'https://forms.gle/UZ9dJCaGH9YAVdtN9';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { priceId, customerEmail, customerName, packageType, paymentType = 'full' } = body;

    // Debug log
    console.log('Checkout request:', JSON.stringify(body));

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get package info from our internal map instead of from Stripe
    const packageInfo = PACKAGE_INFO[priceId as keyof typeof PACKAGE_INFO];
    
    if (!packageInfo) {
      // Debug more information about the invalid price ID
      console.error(`Invalid package ID: ${priceId}. Available packages: ${Object.keys(PACKAGE_INFO).join(', ')}`);
      return NextResponse.json(
        { error: `Invalid package ID: ${priceId}` },
        { status: 400 }
      );
    }

    // Create a new Stripe customer without requiring an account
    const customer = await stripe.customers.create({
      email: customerEmail || '',
      name: customerName || 'New Customer',
      metadata: {
        packageType: packageType || 'standard',
        paymentType
      }
    });
    
    console.log(`Created Stripe customer: ${customer.id} for checkout`);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Create line items based on payment type
    const lineItems = [];
    const depositAmount = DEPOSIT_AMOUNTS[priceId as keyof typeof DEPOSIT_AMOUNTS] || 50000;
    
    if (paymentType === 'deposit') {
      // Add deposit as a separate line item
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${packageInfo.name} - Initial Deposit`,
            description: 'Initial deposit for website development',
          },
          unit_amount: depositAmount,
        },
        quantity: 1,
      });
    } else {
      // Full payment - create price data directly
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: packageInfo.name,
            description: packageInfo.description,
          },
          unit_amount: packageInfo.amount,
        },
        quantity: 1,
      });
    }
    
    // Create the checkout session with redirect to intake form
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: lineItems,
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      customer_email: customerEmail, // Fallback if customer creation failed
      allow_promotion_codes: true,
      success_url: `${CLIENT_INTAKE_FORM_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        packageType: packageType || '',
        paymentType,
        source: 'website_direct',
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