import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import Stripe from 'stripe';
import { getPlanById } from '@/app/data/subscriptionPlans';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(request: Request) {
  try {
    // Get the authenticated session
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Ensure user is a customer and has a Stripe customer ID
    if (session.user.role !== 'customer' || !session.user.stripeCustomerId) {
      return NextResponse.json({ error: 'Not a valid customer account' }, { status: 403 });
    }
    
    const stripeCustomerId = session.user.stripeCustomerId;
    
    // Fetch subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      expand: ['data.default_payment_method', 'data.items.data.price.product'],
    });
    
    if (subscriptions.data.length === 0) {
      return NextResponse.json({ 
        subscription: null,
        hasSubscription: false
      });
    }
    
    // Get the most recent subscription
    const subscription = subscriptions.data[0];
    
    // Get the first subscription item (most subscriptions have just one item)
    const firstItem = subscription.items.data[0];
    const price = firstItem?.price;
    
    // Format the subscription data
    const planId = subscription.metadata.planId || '';
    const plan = getPlanById(planId);
    
    const formattedSubscription = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      planId: planId,
      planName: plan?.name || subscription.metadata.planName || 'Unknown Plan',
      price: price?.unit_amount ? price.unit_amount / 100 : 0,
      interval: price?.recurring?.interval || 'month',
      paymentMethod: subscription.default_payment_method 
        ? {
            brand: (subscription.default_payment_method as any).card?.brand || 'unknown',
            last4: (subscription.default_payment_method as any).card?.last4 || '****',
            expMonth: (subscription.default_payment_method as any).card?.exp_month || '',
            expYear: (subscription.default_payment_method as any).card?.exp_year || '',
          }
        : null
    };
    
    // Fetch recent invoices
    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: 5,
    });
    
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      amount: invoice.amount_paid / 100,
      status: invoice.status,
      date: new Date(invoice.created * 1000).toISOString(),
      pdfUrl: invoice.invoice_pdf,
      number: invoice.number,
    }));
    
    return NextResponse.json({
      subscription: formattedSubscription,
      invoices: formattedInvoices,
      hasSubscription: true
    });
    
  } catch (error: any) {
    console.error('Error fetching customer subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
} 