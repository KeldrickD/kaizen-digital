import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
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
    const { priceId, amount, packageDetails, paymentType = 'full' } = await request.json();
    
    console.log('Checkout request received:', { priceId, amount, paymentType });
    
    let session;
    let packageName: string;
    let packageDescription: string;
    let totalAmount: number;
    let paymentAmount: number;
    let remainingAmount: number;
    
    // Handle custom pricing
    if (priceId === 'custom') {
      // Calculate the amount based on payment type
      paymentAmount = paymentType === 'deposit' ? DEPOSIT_AMOUNT : amount;
      remainingAmount = paymentType === 'deposit' ? amount - DEPOSIT_AMOUNT : 0;
      totalAmount = amount;
      packageName = 'Custom Website Package';
      packageDescription = `${packageDetails.pages} with ${packageDetails.features.join(', ')}${
        packageDetails.maintenance !== 'None' 
          ? ` and ${packageDetails.maintenance} maintenance`
          : ''
      }`;
      
      // Create a session with custom price
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: paymentType === 'deposit' 
                  ? 'Deposit for Custom Website Package' 
                  : 'Custom Website Package',
                description: `${packageDescription}${paymentType === 'deposit' ? ' (Deposit payment)' : ''}`,
              },
              unit_amount: paymentAmount, // Amount in cents
            },
            quantity: 1,
          } as any, // Cast to any to bypass TypeScript checking
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}?canceled=true`,
        metadata: {
          packageType: 'custom',
          packageName,
          packageDescription,
          pages: packageDetails.pages,
          features: packageDetails.features.join(','),
          maintenance: packageDetails.maintenance,
          paymentType,
          totalAmount: totalAmount.toString(),
          remainingAmount: remainingAmount.toString(),
        },
      });
    } else {
      // Get package info based on priceId
      let packageInfo = PACKAGE_INFO[priceId];
      
      // If the priceId is not found, default to starter package
      if (!packageInfo) {
        console.warn(`Invalid priceId provided: ${priceId}, defaulting to Starter`);
        packageInfo = PACKAGE_INFO.price_starter;
      }
      
      // Calculate the amount based on payment type
      paymentAmount = paymentType === 'deposit' ? DEPOSIT_AMOUNT : packageInfo.amount;
      remainingAmount = paymentType === 'deposit' ? packageInfo.amount - DEPOSIT_AMOUNT : 0;
      totalAmount = packageInfo.amount;
      packageName = packageInfo.name;
      packageDescription = packageInfo.description;
      
      // Create a dynamic price for the standard package
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: paymentType === 'deposit' 
                  ? `Deposit for ${packageInfo.name}` 
                  : packageInfo.name,
                description: `${packageInfo.description}${paymentType === 'deposit' ? ' (Deposit payment)' : ''}`,
              },
              unit_amount: paymentAmount,
            },
            quantity: 1,
          } as any, // Cast to any to bypass TypeScript checking
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}?canceled=true`,
        metadata: {
          packageType: priceId,
          packageName,
          packageDescription,
          paymentType,
          totalAmount: totalAmount.toString(),
          remainingAmount: remainingAmount.toString(),
        },
      });
    }
    
    // After creating the session, store the payment information
    try {
      // Only store payment information for deposit payments (we'll handle full payments on session completion)
      if (paymentType === 'deposit') {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: session.id,
            amount: paymentAmount,
            remainingAmount,
            paymentType,
            packageType: priceId,
            status: 'pending', // Will be updated to 'paid' when webhook confirms payment
            description: `${paymentType === 'deposit' ? 'Deposit for ' : ''}${packageName}: ${packageDescription}`,
            customerEmail: '', // Will be updated after payment with webhook
            metadata: {
              packageName,
              packageDescription,
              totalAmount,
            },
          }),
        });
      }
    } catch (storageError) {
      console.error('Error storing payment info:', storageError);
      // Continue even if storage fails - we'll rely on webhooks as backup
    }
    
    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('Checkout session error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
} 