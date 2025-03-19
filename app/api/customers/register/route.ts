import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Customer registration schema
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  planId: z.string().optional(),
  paymentMethodId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const { name, email, password, planId, paymentMethodId } = registerSchema.parse(body);
    
    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });
    
    if (existingCustomer) {
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create a Stripe customer
    const stripeCustomer = await stripe.customers.create({
      name,
      email,
      metadata: {
        source: 'kaizen-website',
      },
    });
    
    // If there's a payment method, attach it to the customer
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomer.id,
      });
      
      // Set as default payment method
      await stripe.customers.update(stripeCustomer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }
    
    // Create the customer in the database
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        passwordHash,
        stripeCustomerId: stripeCustomer.id,
      },
    });
    
    // If there's a plan ID, create a subscription
    if (planId && paymentMethodId) {
      try {
        // Create the subscription
        const subscription = await stripe.subscriptions.create({
          customer: stripeCustomer.id,
          items: [
            {
              price: planId,
            },
          ],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });
        
        // Get the plan details
        const product = await stripe.products.retrieve(
          (await stripe.prices.retrieve(planId)).product as string
        );
        
        // Store the subscription in our database
        await prisma.subscription.create({
          data: {
            customerId: customer.id,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            planName: product.name,
            planPrice: (await stripe.prices.retrieve(planId)).unit_amount || 0,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
      } catch (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError);
      }
    }
    
    return NextResponse.json(
      {
        message: 'Customer registered successfully',
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Customer registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to register customer' },
      { status: 500 }
    );
  }
} 