import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'mail.privateemail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER || 'admin@kaizendigital.design',
    pass: process.env.EMAIL_PASS,
  },
});

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
    
    if (!session.customer || !session.customer_email) {
      console.error('Missing customer info in checkout session');
      return;
    }
    
    const stripeCustomerId = session.customer as string;
    const customerEmail = session.customer_email;
    
    console.log(`Checkout completed for email: ${customerEmail}, stripe ID: ${stripeCustomerId}`);
    
    // Find or create a customer
    let customer = await prisma.customer.findFirst({
      where: { stripeCustomerId },
      include: { subscriptions: true }
    });
    
    if (!customer) {
      customer = await prisma.customer.findFirst({
        where: { email: customerEmail },
        include: { subscriptions: true }
      });
      
      if (!customer) {
        // Create a new customer if they don't exist
        const nameFromSession = session.customer_details?.name || 'New Customer';
        
        // Generate initial password
        const password = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        customer = await prisma.customer.create({
          data: {
            name: nameFromSession,
            email: customerEmail,
            stripeCustomerId,
            passwordHash: hashedPassword,
          },
          include: { subscriptions: true }
        });
        
        console.log(`Created new customer: ${customer.id} for email: ${customerEmail}`);
        
        // Always send credentials for new customers
        try {
          await sendCredentialsEmail({
            to: customerEmail,
            name: nameFromSession,
            password,
            subscriptionType: 'Website Service',
          });
          console.log(`Sent credentials email to new customer ${customerEmail}`);
        } catch (emailError) {
          console.error('Error sending credentials to new customer:', emailError);
        }
      } else {
        // Update existing customer with Stripe ID
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: { stripeCustomerId },
          include: { subscriptions: true }
        });
        
        console.log(`Updated customer ${customer.id} with Stripe ID: ${stripeCustomerId}`);
      }
    }
    
    // ALWAYS generate a new password and send credentials after payment
    // This ensures customers get their login details immediately
    const password = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    try {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { passwordHash: hashedPassword }
      });
      
      console.log(`Updated password for customer ${customer.id}`);
    } catch (dbError) {
      console.error('Error updating customer password:', dbError);
    }
    
    // Send login credentials via email - always attempt this for all customers
    try {
      await sendCredentialsEmail({
        to: customerEmail,
        name: customer.name,
        password,
        subscriptionType: customer.subscriptions?.[0]?.planName || 'Website Service',
      });
      console.log(`Sent credentials email to ${customerEmail} after checkout`);
    } catch (emailError) {
      console.error('Error sending credentials email:', emailError);
      // Log detailed error information
      console.error('Email error details:', JSON.stringify(emailError));
    }
    
    // If subscription was purchased, it will be handled by the subscription.created event
    console.log('Checkout session processing completed for customer:', customer.id);
  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}

// Function to send login credentials to the customer
async function sendCredentialsEmail({ to, name, password, subscriptionType }: {
  to: string;
  name: string;
  password: string;
  subscriptionType: string;
}) {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kaizendigitaldesign.com'}/auth/customer-login?callbackUrl=/dashboard`;
  const googleFormUrl = "https://forms.gle/UZ9dJCaGH9YAVdtN9";

  const mailOptions = {
    from: `"Kaizen Digital" <${process.env.EMAIL_FROM || 'admin@kaizendigital.design'}>`,
    to,
    subject: `Your Kaizen Digital Account Created`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #e61919; margin: 0;">Kaizen Digital Design</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
          <h2>Thank You for Your Purchase!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for choosing Kaizen Digital Design. Your payment has been processed successfully.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #e61919;">
            <p style="margin-top: 0;"><strong>Next Step:</strong> Please complete our website information form to help us understand your needs:</p>
            <div style="text-align: center; margin: 15px 0;">
              <a href="${googleFormUrl}" style="background-color: #e61919; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Complete Website Information Form</a>
            </div>
          </div>
          
          <p><strong>Here are your dashboard login credentials:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <div style="margin: 25px 0; text-align: center;">
            <a href="${loginUrl}" style="background-color: #3a86ff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Your Dashboard</a>
          </div>
          <p>Please keep this information secure. You can access your dashboard at any time to track your subscription and manage your account.</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          <p>Thank you for choosing Kaizen Digital Design!</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Kaizen Digital Design. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  // Log email attempt
  console.log('Attempting to send credentials email to:', to);

  // Only attempt to send if we have email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email sending skipped - no credentials provided');
    console.log('Would have sent credentials email to:', to);
    return;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Credentials email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw error;
  }
} 