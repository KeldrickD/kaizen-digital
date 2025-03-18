import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event;

  try {
    if (!sig || !endpointSecret) {
      console.warn('Webhook signature or endpoint secret missing');
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer details
        const customerEmail = session.customer_details?.email || '';
        const customerName = session.customer_details?.name || '';
        
        // Get payment metadata
        const paymentType = session.metadata?.paymentType || 'full';
        const packageType = session.metadata?.packageType || '';
        const totalAmount = session.metadata?.totalAmount || '0';
        const remainingAmount = session.metadata?.remainingAmount || '0';
        const packageName = session.metadata?.packageName || '';
        const packageDescription = session.metadata?.packageDescription || '';
        const amountTotal = session.amount_total || 0;
        
        // If this is a deposit payment, create a new payment record
        if (paymentType === 'deposit') {
          try {
            const response = await fetch(new URL('/api/payments/store', request.url).toString(), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: session.id,
                customerEmail,
                customerName,
                amount: parseInt(amountTotal.toString()) || 0,
                remainingAmount: parseInt(remainingAmount) || 0,
                paymentType: 'deposit',
                packageType,
                status: 'paid',
                description: `${packageName} (Deposit): ${packageDescription}`,
                metadata: {
                  packageName,
                  packageDescription,
                  totalAmount
                },
              }),
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Failed to create payment record:', errorText);
            } else {
              console.log('Successfully created payment record for deposit');
              
              // Send email notification to customer
              try {
                await fetch(new URL('/api/email/send-payment-notification', request.url).toString(), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    templateType: 'deposit_confirmation',
                    customerEmail,
                    customerName,
                    amount: parseInt(amountTotal.toString()) || 0,
                    remainingAmount: parseInt(remainingAmount) || 0,
                    packageType: packageName || packageType,
                  }),
                });
                
                // Send admin notification
                await fetch(new URL('/api/email/send-payment-notification', request.url).toString(), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    templateType: 'admin_notification',
                    customerEmail,
                    customerName,
                    amount: parseInt(amountTotal.toString()) || 0,
                    remainingAmount: parseInt(remainingAmount) || 0,
                    packageType: packageName || packageType,
                  }),
                });
              } catch (emailError) {
                console.error('Error sending email notification:', emailError);
              }
            }
          } catch (error) {
            console.error('Error storing payment data:', error);
          }
        } else {
          // For full payments, create a new completed payment record
          try {
            const response = await fetch(new URL('/api/payments/store', request.url).toString(), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: session.id,
                amount: parseInt(totalAmount) || parseInt(amountTotal.toString()) || 0,
                remainingAmount: 0,
                paymentType: 'full',
                packageType,
                status: 'completed',
                customerEmail,
                customerName,
                description: `${packageName}: ${packageDescription}`,
                metadata: {
                  packageName,
                  packageDescription,
                },
              }),
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Failed to create payment record:', errorText);
            } else {
              console.log('Successfully created payment record for full payment');
              
              // Send email notification to customer
              try {
                await fetch(new URL('/api/email/send-payment-notification', request.url).toString(), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    templateType: 'payment_complete',
                    customerEmail,
                    customerName,
                    amount: parseInt(amountTotal.toString()) || 0,
                    remainingAmount: 0,
                    packageType: packageName || packageType,
                  }),
                });
                
                // Send admin notification
                await fetch(new URL('/api/email/send-payment-notification', request.url).toString(), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    templateType: 'admin_notification',
                    customerEmail,
                    customerName,
                    amount: parseInt(amountTotal.toString()) || 0,
                    remainingAmount: 0,
                    packageType: packageName || packageType,
                  }),
                });
              } catch (emailError) {
                console.error('Error sending email notification:', emailError);
              }
            }
          } catch (error) {
            console.error('Error storing payment data:', error);
          }
        }
        
        break;
      }
      
      case 'payment_intent.succeeded': {
        // Handle successful payment intents if needed
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
        break;
      }
      
      case 'payment_link.created': {
        const paymentLink = event.data.object as Stripe.PaymentLink;
        console.log(`Payment link created: ${paymentLink.url}`);
        break;
      }
      
      // Add more event handlers as needed
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Error processing webhook: ${err.message}`);
    return NextResponse.json(
      { error: `Error processing webhook: ${err.message}` },
      { status: 500 }
    );
  }
} 