import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature');

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  try {
    console.log(`Processing webhook event: ${event.type}`);
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Find the customer by Stripe customer ID
    const customer = await prisma.customer.findFirst({
      where: { stripeCustomerId: subscription.customer as string },
    });

    if (!customer) {
      console.error(`Customer not found for Stripe customer ID: ${subscription.customer}`);
      return;
    }

    // Get the price details
    const price = await stripe.prices.retrieve(
      subscription.items.data[0].price.id
    );
    
    // Get the product details
    const product = await stripe.products.retrieve(price.product as string);

    // Check if a subscription record already exists
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (existingSubscription) {
      // Update the existing subscription
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: subscription.status,
          planName: product.name,
          planPrice: price.unit_amount || 0,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
    } else {
      // Create a new subscription record
      await prisma.subscription.create({
        data: {
          customerId: customer.id,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          planName: product.name,
          planPrice: price.unit_amount || 0,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Find the subscription in our database
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (existingSubscription) {
      // Update the status to canceled
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: 'canceled',
          cancelAtPeriodEnd: false,
        },
      });
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
    throw error;
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  try {
    // Only process subscription invoices
    if (!invoice.subscription) return;

    // Find the customer by Stripe customer ID
    const customer = await prisma.customer.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    });

    if (!customer) {
      console.error(`Customer not found for Stripe customer ID: ${invoice.customer}`);
      return;
    }

    // Check if we already have this invoice recorded
    const existingInvoice = await prisma.invoice.findFirst({
      where: { stripeInvoiceId: invoice.id },
    });

    if (existingInvoice) {
      // Update the existing invoice
      await prisma.invoice.update({
        where: { id: existingInvoice.id },
        data: {
          status: invoice.status,
          amount: invoice.amount_paid,
          invoicePdf: invoice.invoice_pdf,
        },
      });
    } else {
      // Create a new invoice record
      await prisma.invoice.create({
        data: {
          customerId: customer.id,
          stripeInvoiceId: invoice.id,
          invoiceNumber: invoice.number,
          amount: invoice.amount_paid,
          status: invoice.status,
          invoicePdf: invoice.invoice_pdf,
          invoiceDate: new Date(invoice.created * 1000),
        },
      });
    }
  } catch (error) {
    console.error('Error handling invoice payment:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Find the customer by Stripe customer ID
    const customer = await prisma.customer.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    });

    if (!customer) {
      console.error(`Customer not found for Stripe customer ID: ${invoice.customer}`);
      return;
    }

    // Check if we already have this invoice recorded
    const existingInvoice = await prisma.invoice.findFirst({
      where: { stripeInvoiceId: invoice.id },
    });

    if (existingInvoice) {
      // Update the existing invoice
      await prisma.invoice.update({
        where: { id: existingInvoice.id },
        data: {
          status: invoice.status,
        },
      });
    } else {
      // Create a new invoice record
      await prisma.invoice.create({
        data: {
          customerId: customer.id,
          stripeInvoiceId: invoice.id,
          invoiceNumber: invoice.number,
          amount: invoice.amount_due,
          status: invoice.status,
          invoicePdf: invoice.invoice_pdf,
          invoiceDate: new Date(invoice.created * 1000),
        },
      });
    }

    // If there's a subscription, update its status
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      await handleSubscriptionUpdated(subscription);
    }
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
    throw error;
  }
} 