import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import { sendCredentialsEmail, sendEmail } from '@/lib/email';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
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
        
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
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
          status: invoice.status || 'unknown',
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
          status: invoice.status || 'unknown',
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
          status: invoice.status || 'payment_failed',
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
          status: invoice.status || 'payment_failed',
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing checkout session completed:', session.id);
    
    // Basic validation
    if (!session.customer || !session.customer_email) {
      console.error('Missing customer info in checkout session');
      return;
    }
    
    const stripeCustomerId = session.customer as string;
    const customerEmail = session.customer_email;
    const customerName = session.customer_details?.name || 'New Customer';
    const customerPhone = session.customer_details?.phone || '';
    const packageType = session.metadata?.packageType || 'standard';
    
    console.log(`Payment received for email: ${customerEmail}, stripe ID: ${stripeCustomerId}`);
    
    // Record the completed order
    try {
      // Store order information - even without user account
      // Check if we already have this customer in our database
      let customer = await prisma.customer.findFirst({
        where: { 
          OR: [
            { stripeCustomerId },
            { email: customerEmail }
          ]
        }
      });
      
      // If no customer exists, create a temporary one to track the order
      if (!customer) {
        // Generate a temporary password just in case we need it later
        const password = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            email: customerEmail,
            stripeCustomerId,
            passwordHash: hashedPassword,
            phone: customerPhone,
          }
        });
        
        console.log(`Created new temporary customer: ${customer.id} for email: ${customerEmail}`);
      }
      
      // Record the payment/order information
      const paymentData = {
        customerId: customer.id,
        stripeSessionId: session.id,
        amount: session.amount_total || 0,
        status: 'paid',
        packageType,
        paymentDate: new Date(),
      };
      
      console.log(`Recorded payment data:`, paymentData);
      
      // Send notification email to admin about new order
      try {
        await sendAdminNotificationEmail({
          customerName,
          customerEmail,
          customerPhone,
          packageType,
          amount: (session.amount_total || 0) / 100, // Convert to dollars
          sessionId: session.id,
        });
        console.log(`Sent admin notification email for order from ${customerEmail}`);
      } catch (emailError) {
        console.error('Error sending admin notification email:', emailError);
      }
      
      // Send confirmation email to customer
      try {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          name: customerName,
          packageType,
          amount: (session.amount_total || 0) / 100, // Convert to dollars
          orderNumber: session.id.substring(session.id.length - 8), // Last 8 chars
          nextSteps: "Please complete the intake form to share your requirements and preferences. We'll start working on your project right away!",
        });
        console.log(`Sent order confirmation email to ${customerEmail}`);
      } catch (emailError) {
        console.error('Error sending customer confirmation email:', emailError);
      }
    } catch (error) {
      console.error('Error processing payment record:', error);
    }
  } catch (error: unknown) {
    console.error('Error handling stripe webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { status: 500 }
    );
  }
}

// New email function for admin notifications
async function sendAdminNotificationEmail({ 
  customerName, 
  customerEmail, 
  customerPhone, 
  packageType, 
  amount, 
  sessionId 
}: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageType: string;
  amount: number;
  sessionId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'your-admin-email@example.com';
  
  const subject = `New Website Order: ${packageType}`;
  const textContent = `
    New order received:
    
    Package: ${packageType}
    Amount: $${amount.toFixed(2)}
    
    Customer Details:
    Name: ${customerName}
    Email: ${customerEmail}
    Phone: ${customerPhone}
    
    Order ID: ${sessionId}
    
    The customer has been redirected to the intake form.
  `;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; padding: 20px; text-align: center;">
        <h1 style="color: #e61919; margin: 0;">New Website Order</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
        <h2>${packageType} Package</h2>
        <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        
        <h3>Customer Details:</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        
        <p><strong>Order ID:</strong> ${sessionId}</p>
        
        <p>The customer has been redirected to the intake form.</p>
      </div>
    </div>
  `;
  
  // Use email sending function with required html property
  await sendEmail({
    to: adminEmail,
    subject,
    text: textContent,
    html: htmlContent,
  });
}

// New email function for order confirmations
async function sendOrderConfirmationEmail({ 
  to, 
  name, 
  packageType, 
  amount, 
  orderNumber,
  nextSteps
}: {
  to: string;
  name: string;
  packageType: string;
  amount: number;
  orderNumber: string;
  nextSteps: string;
}) {
  const subject = `Your Website Order Confirmation (#${orderNumber})`;
  const textContent = `
    Hello ${name},
    
    Thank you for your order! We're excited to work on your new website.
    
    Order Summary:
    Package: ${packageType}
    Amount: $${amount.toFixed(2)}
    Order #: ${orderNumber}
    
    Next Steps:
    ${nextSteps}
    
    If you have any questions, please contact us at support@kaizendigitaldesign.com.
    
    Best regards,
    The Kaizen Digital Design Team
  `;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; padding: 20px; text-align: center;">
        <h1 style="color: #e61919; margin: 0;">Kaizen Digital Design</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
        <h2>Order Confirmation #${orderNumber}</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your order! We're excited to work on your new website.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Summary:</h3>
          <p><strong>Package:</strong> ${packageType}</p>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Order #:</strong> ${orderNumber}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #e61919;">
          <h3 style="margin-top: 0;">Next Steps:</h3>
          <p>${nextSteps}</p>
        </div>
        
        <p>If you have any questions, please contact us at support@kaizendigitaldesign.com.</p>
        
        <p>Best regards,<br>
        The Kaizen Digital Design Team</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p>© ${new Date().getFullYear()} Kaizen Digital Design. All rights reserved.</p>
      </div>
    </div>
  `;
  
  // Use email sending function with required html property
  await sendEmail({
    to,
    subject,
    text: textContent,
    html: htmlContent,
  });
} 