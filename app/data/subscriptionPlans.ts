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
  category?: 'maintenance' | 'seo'; // Add category to distinguish between plan types
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
    color: 'blue',
    category: 'maintenance'
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
    color: 'red',
    category: 'maintenance'
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
    color: 'purple',
    category: 'maintenance'
  }
];

// Add new SEO subscription plans
export const seoPlans: SubscriptionPlan[] = [
  {
    id: 'seo-starter-monthly',
    name: 'Starter SEO Plan',
    price: 150,
    interval: 'month',
    description: 'Essential SEO services to improve your website visibility.',
    features: [
      'Basic SEO setup and optimization',
      '1 blog article per month',
      'Keyword research',
      'On-page SEO optimization',
      'Monthly performance report',
      'Meta description optimization'
    ],
    color: 'green',
    category: 'seo'
  },
  {
    id: 'seo-growth-monthly',
    name: 'Growth SEO Plan',
    price: 300,
    interval: 'month',
    description: 'Intermediate SEO and content strategy to increase your organic traffic.',
    features: [
      'Everything in Starter plan',
      '2 blog articles per month',
      'Competitor analysis',
      'Content strategy development',
      'Google Search Console setup & monitoring',
      'Detailed analytics reports',
      'Image optimization'
    ],
    popular: true,
    color: 'orange',
    category: 'seo'
  },
  {
    id: 'seo-scale-monthly',
    name: 'Scale SEO Plan',
    price: 500,
    interval: 'month',
    description: 'Comprehensive SEO and content marketing to maximize your online reach.',
    features: [
      'Everything in Growth plan',
      '4 blog articles per month',
      'Advanced link building',
      'Content promotion strategy',
      'Social media sharing',
      'Quarterly SEO strategy review',
      'Conversion rate optimization',
      'Custom reporting dashboard'
    ],
    color: 'teal',
    category: 'seo'
  }
];

// Function to get a specific plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return [...maintenancePlans, ...seoPlans].find(plan => plan.id === planId);
}

// Function to get all plans by category
export function getPlansByCategory(category: 'maintenance' | 'seo'): SubscriptionPlan[] {
  return category === 'maintenance' ? maintenancePlans : seoPlans;
} 