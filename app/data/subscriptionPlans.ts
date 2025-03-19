export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
  stripePriceId?: string; // We'll add real Stripe price IDs later
  color?: string;
}

export const maintenancePlans: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Basic Maintenance',
    price: 150,
    interval: 'month',
    description: 'Essential website maintenance to keep your site running smoothly.',
    features: [
      'Monthly website updates',
      'Small design tweaks',
      'Hosting management',
      'WordPress updates',
      '24/7 uptime monitoring',
      'Email support'
    ],
    color: 'blue'
  },
  {
    id: 'growth-monthly',
    name: 'Growth Maintenance',
    price: 300,
    interval: 'month',
    description: 'Advanced maintenance and optimization to grow your online presence.',
    features: [
      'Everything in Basic plan',
      'Security updates and monitoring',
      'SEO tweaks and improvements',
      'Performance optimization',
      'Monthly analytics review',
      'Priority email & phone support',
      'Content updates (up to 5 pages)'
    ],
    popular: true,
    color: 'red'
  },
  {
    id: 'elite-monthly',
    name: 'Elite Maintenance',
    price: 500,
    interval: 'month',
    description: 'Comprehensive website management to maximize your online potential.',
    features: [
      'Everything in Growth plan',
      'Monthly blog content (1 post)',
      'Advanced SEO strategy',
      'Detailed analytics reports',
      'Conversion optimization',
      'Dedicated account manager',
      'Monthly strategy call',
      'Unlimited content updates'
    ],
    color: 'purple'
  }
];

// Function to get a specific plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return maintenancePlans.find(plan => plan.id === planId);
} 