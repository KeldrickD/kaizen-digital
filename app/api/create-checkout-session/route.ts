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
const PACKAGE_INFO: Record<Exclude<PackageId, 'custom'>, {
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
    let session;
    
    // Handle custom pricing
    if (priceId === 'custom') {
      // Calculate the amount based on payment type
      const paymentAmount = paymentType === 'deposit' ? DEPOSIT_AMOUNT : amount;
      const remainingAmount = paymentType === 'deposit' ? amount - DEPOSIT_AMOUNT : 0;
      
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
                description: `${packageDetails.pages} with ${packageDetails.features.join(', ')}${
                  packageDetails.maintenance !== 'None' 
                    ? ` and ${packageDetails.maintenance} maintenance`
                    : ''
                }${paymentType === 'deposit' ? ' (Deposit payment)' : ''}`,
              },
              unit_amount: paymentAmount, // Amount in cents
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
          paymentType,
          totalAmount: amount.toString(),
          remainingAmount: remainingAmount.toString(),
        },
      });
    } else {
      // Get package info based on priceId
      const packageInfo = PACKAGE_INFO[priceId as Exclude<PackageId, 'custom'>];
      
      if (!packageInfo) {
        return NextResponse.json(
          { error: 'Invalid package type' },
          { status: 400 }
        );
      }
      
      // Calculate the amount based on payment type
      const paymentAmount = paymentType === 'deposit' ? DEPOSIT_AMOUNT : packageInfo.amount;
      const remainingAmount = paymentType === 'deposit' ? packageInfo.amount - DEPOSIT_AMOUNT : 0;
      
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
          },
        ],
        mode: 'payment',
        success_url: `${request.headers.get('origin')}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get('origin')}?canceled=true`,
        metadata: {
          packageType: priceId,
          paymentType,
          totalAmount: packageInfo.amount.toString(),
          remainingAmount: remainingAmount.toString(),
        },
      });
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