import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe with production key
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
    description: '3-page professional site with mobile-friendly design',
    // Production Stripe price ID (can be added when available)
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || ''
  },
  price_business: {
    name: 'Business Pro',
    amount: 150000, // $1,500.00 in cents
    description: '5-page website with lead capture form & custom branding',
    // Production Stripe price ID (can be added when available)
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID || ''
  },
  price_elite: {
    name: 'Elite Custom Site',
    amount: 250000, // $2,500.00 in cents
    description: 'Fully custom design with e-commerce or interactive elements',
    // Production Stripe price ID (can be added when available)
    stripePriceId: process.env.STRIPE_ELITE_PRICE_ID || ''
  }
};

// Standard deposit amount for each package
const DEPOSIT_AMOUNTS = {
  price_starter: 25000,  // $250
  price_business: 50000, // $500
  price_elite: 75000,    // $750
};

// Google form URL for client intake after payment
const CLIENT_INTAKE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdfTwfxqZzoHI2Bp2KfX6ZdVP-awJEd_8swn-uZNyTXig1xMg/viewform?usp=dialog';

export async function POST(request: Request) {
  try {
    let body;
    const contentType = request.headers.get('content-type') || '';
    
    // Parse the request body based on content type
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }
    
    const { priceId, customerEmail, customerName, packageType, paymentType = 'full', mode = 'default' } = body;

    // Debug log
    console.log('Checkout request:', JSON.stringify(body));

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get package info from our internal map instead of from Stripe
    let packageInfo = PACKAGE_INFO[priceId as keyof typeof PACKAGE_INFO];
    
    // If package info not found, try to infer from the package name/type
    if (!packageInfo && packageType) {
      const packageTypeLower = packageType.toLowerCase();
      
      if (packageTypeLower.includes('starter') || packageTypeLower.includes('agent brand')) {
        packageInfo = PACKAGE_INFO.price_starter;
        console.log(`Inferred package from name '${packageType}' -> price_starter`);
      }
      else if (packageTypeLower.includes('business') || packageTypeLower.includes('growth')) {
        packageInfo = PACKAGE_INFO.price_business;
        console.log(`Inferred package from name '${packageType}' -> price_business`);
      }
      else if (packageTypeLower.includes('elite') || packageTypeLower.includes('producer')) {
        packageInfo = PACKAGE_INFO.price_elite;
        console.log(`Inferred package from name '${packageType}' -> price_elite`);
      }
    }
    
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
      // For deposits, we always create price data dynamically since deposits are partial payments
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
      // Full payment - If a Stripe price ID exists, use it, otherwise create dynamically
      if (packageInfo.stripePriceId) {
        // Use existing price ID in production
        lineItems.push({
          price: packageInfo.stripePriceId,
          quantity: 1,
        });
      } else {
        // Create price data dynamically as fallback
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
      cancel_url: `${baseUrl}/`,
      metadata: {
        packageType: packageType || '',
        paymentType,
        source: 'website_direct',
      },
    });

    // If direct mode is requested and we have a URL, perform a 302 redirect
    if (mode === 'direct' && checkoutSession.url) {
      return NextResponse.redirect(checkoutSession.url, { status: 302 });
    } 
    
    // Otherwise return the session ID (for compatibility with older code)
    return NextResponse.json({ 
      id: checkoutSession.id,
      url: checkoutSession.url
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 