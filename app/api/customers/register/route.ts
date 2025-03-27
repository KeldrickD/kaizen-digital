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
    console.log('Customer registration - Processing request');
    const body = await request.json();
    
    // Validate the request body
    const { name, email, password, planId, paymentMethodId } = registerSchema.parse(body);
    console.log(`Customer registration - Validated data for email: ${email}`);
    
    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });
    
    if (existingCustomer) {
      console.log(`Customer registration - Email already exists: ${email}`);
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Customer registration - Password hashed successfully');
    
    try {
      // Create a Stripe customer
      console.log(`Customer registration - Creating Stripe customer for: ${email}`);
      const stripeCustomer = await stripe.customers.create({
        name,
        email,
        metadata: {
          source: 'kaizen-website',
        },
      });
      console.log(`Customer registration - Stripe customer created: ${stripeCustomer.id}`);
      
      // If there's a payment method, attach it to the customer
      if (paymentMethodId) {
        console.log(`Customer registration - Attaching payment method: ${paymentMethodId}`);
        try {
          await stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomer.id,
          });
          
          // Set as default payment method
          await stripe.customers.update(stripeCustomer.id, {
            invoice_settings: {
              default_payment_method: paymentMethodId,
            },
          });
          console.log('Customer registration - Payment method attached and set as default');
        } catch (paymentError) {
          console.error('Error attaching payment method:', paymentError);
          // Continue with registration even if payment method attachment fails
        }
      }
      
      try {
        // Create the customer in the database
        console.log('Customer registration - Creating customer record in database');
        const customer = await prisma.customer.create({
          data: {
            name,
            email,
            passwordHash,
            stripeCustomerId: stripeCustomer.id,
          },
        });
        console.log(`Customer registration - Database record created: ${customer.id}`);
        
        // If there's a plan ID, create a subscription
        if (planId && paymentMethodId) {
          try {
            console.log(`Customer registration - Creating subscription for plan: ${planId}`);
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
            console.log(`Customer registration - Subscription created: ${subscription.id}`);
          } catch (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError);
            // Continue with registration even if subscription creation fails
          }
        }
        
        console.log('Customer registration - Process completed successfully');
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
      } catch (dbError) {
        console.error('Error creating customer in database:', dbError);
        // If we failed to create a customer in our database but created a Stripe customer,
        // we should clean up the Stripe customer to prevent orphaned resources
        try {
          await stripe.customers.del(stripeCustomer.id);
          console.log(`Cleaned up orphaned Stripe customer: ${stripeCustomer.id}`);
        } catch (cleanupError) {
          console.error('Failed to clean up Stripe customer:', cleanupError);
        }
        
        throw dbError; // Re-throw to be caught by outer try-catch
      }
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      throw stripeError; // Re-throw to be caught by outer try-catch
    }
  } catch (error: any) {
    console.error('Customer registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    
    // Check for Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to register customer', details: error.message },
      { status: 500 }
    );
  }
} 