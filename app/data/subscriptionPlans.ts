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
  category?: 'maintenance' | 'seo' | 'ads'; // Add ads category
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

// Add Facebook Ad Management plans
export const adPlans: SubscriptionPlan[] = [
  {
    id: 'ads-starter-monthly',
    name: 'Starter Ad Management',
    price: 300,
    interval: 'month',
    description: 'Basic Facebook & Instagram ad management to start attracting leads.',
    features: [
      'Facebook & Instagram ad setup',
      'One ad campaign active at a time',
      'Basic audience targeting',
      'Monthly performance reports',
      'Ad creative review',
      'Weekly monitoring & optimization',
      'Up to $1,500 ad spend management'
    ],
    color: 'blue',
    category: 'ads'
  },
  {
    id: 'ads-growth-monthly',
    name: 'Growth Ad Management',
    price: 600,
    interval: 'month',
    description: 'Advanced ad strategies to scale your customer acquisition.',
    features: [
      'Everything in Starter plan',
      'Up to 3 ad campaigns active',
      'Advanced audience targeting',
      'A/B testing of ad creative',
      'Custom landing page recommendations',
      'Bi-weekly optimization',
      'Competitor ad analysis',
      'Up to $5,000 ad spend management'
    ],
    popular: true,
    color: 'purple',
    category: 'ads'
  },
  {
    id: 'ads-elite-monthly',
    name: 'Elite Ad Management',
    price: 1000,
    interval: 'month',
    description: 'Comprehensive ad strategy with full-funnel marketing approach.',
    features: [
      'Everything in Growth plan',
      '5+ ad campaigns active',
      'Custom audience creation',
      'Retargeting campaigns',
      'Email marketing integration',
      'Full-funnel strategy',
      'Custom dashboard reporting',
      'Lead nurturing strategy',
      'Weekly strategy optimization',
      'Unlimited ad spend management'
    ],
    color: 'indigo',
    category: 'ads'
  }
];

// Function to get a specific plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return [...maintenancePlans, ...seoPlans, ...adPlans].find(plan => plan.id === planId);
}

// Function to get all plans by category
export function getPlansByCategory(category: 'maintenance' | 'seo' | 'ads'): SubscriptionPlan[] {
  if (category === 'maintenance') return maintenancePlans;
  if (category === 'seo') return seoPlans;
  return adPlans;
} 