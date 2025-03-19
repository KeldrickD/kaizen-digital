import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Define interfaces for our models
interface Invoice {
  id: string;
  invoiceNumber: string | null;
  amount: number;
  status: string;
  invoiceDate: Date;
  invoicePdf: string | null;
}

export async function GET(request: Request) {
  try {
    // Get the current user session
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the customer from the database
    const customer = await prisma.customer.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    // Get the customer's active subscription
    const subscription = customer.subscriptions[0];
    
    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }
    
    // Get subscription details from Stripe for the most up-to-date information
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );
    
    // Get the default payment method
    const paymentMethod = stripeSubscription.default_payment_method 
      ? await stripe.paymentMethods.retrieve(stripeSubscription.default_payment_method as string)
      : null;
    
    // Get the most recent invoice for this subscription
    const invoices = await prisma.invoice.findMany({
      where: { customerId: customer.id },
      orderBy: { invoiceDate: 'desc' },
      take: 5,
    });
    
    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: stripeSubscription.status,
        planName: subscription.planName,
        planPrice: subscription.planPrice,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        paymentMethod: paymentMethod ? {
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
          expMonth: paymentMethod.card?.exp_month,
          expYear: paymentMethod.card?.exp_year,
        } : null,
      },
      invoices: invoices.map((invoice: Invoice) => ({
        id: invoice.id,
        number: invoice.invoiceNumber,
        amount: invoice.amount,
        status: invoice.status,
        date: invoice.invoiceDate,
        pdfUrl: invoice.invoicePdf,
      })),
    });
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve subscription data' },
      { status: 500 }
    );
  }
} 