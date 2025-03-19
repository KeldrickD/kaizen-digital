export interface Customer {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  stripeCustomerId?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  planName: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  createdAt: string;
  price: number;
  interval: 'month' | 'year';
}

export interface Invoice {
  id: string;
  customerId: string;
  subscriptionId: string;
  amount: number;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  date: string;
  dueDate: string;
  pdfUrl?: string;
  stripeInvoiceId: string;
}

export interface CustomerWithSubscription extends Customer {
  subscription?: Subscription;
} 