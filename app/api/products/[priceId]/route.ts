import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(
  request: Request,
  { params }: { params: { priceId: string } }
) {
  try {
    const priceId = params.priceId;
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Fetch the price from Stripe
    const price = await stripe.prices.retrieve(priceId);
    
    if (!price || !price.product) {
      return NextResponse.json(
        { error: 'Price not found' },
        { status: 404 }
      );
    }

    // Fetch the product details
    const product = await stripe.products.retrieve(
      typeof price.product === 'string' ? price.product : price.product.id
    );

    // Format the response data
    const productDetails = {
      name: product.name,
      description: product.description || 'Website service subscription',
      price: price.unit_amount ? price.unit_amount / 100 : 0, // Convert cents to dollars
      interval: price.recurring?.interval || 'month',
      currency: price.currency || 'usd',
      priceId: price.id,
      productId: product.id,
      active: product.active && price.active,
    };

    return NextResponse.json(productDetails);
  } catch (error: any) {
    console.error('Error fetching product details:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error fetching product details' },
      { status: 500 }
    );
  }
} 