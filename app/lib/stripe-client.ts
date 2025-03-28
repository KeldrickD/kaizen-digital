'use client';

import { loadStripe } from '@stripe/stripe-js';

// Ensure the Stripe publishable key is always available
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51R3aTQI6sCkY7Hh0aY56ZKqHvYfMlfCoVUcqK4HsxGzr1NxLKwESenqKwPfn2NXQN1WXcvsGZr1cOIeOxWJsMZZ000ZMYgcQdy'
);

export default stripePromise; 