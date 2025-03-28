const Stripe = require('stripe');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const WEBSITE_PACKAGES = [
  {
    name: 'Starter Site',
    description: '3-page professional site with mobile-friendly design',
    amount: 75000, // $750.00 in cents
    features: [
      '3 Custom Pages',
      'Mobile-Friendly Design',
      'Contact Form',
      'Basic SEO Setup',
      'Social Media Integration',
      '5 Business Days Delivery'
    ]
  },
  {
    name: 'Business Pro',
    description: '5-page website with lead capture form & custom branding',
    amount: 150000, // $1,500.00 in cents
    features: [
      '5 Custom Pages',
      'Mobile-Friendly Design',
      'Lead Capture Forms',
      'Custom Branding',
      'Advanced SEO Setup',
      'Social Media Integration',
      'Analytics Integration',
      '7 Business Days Delivery'
    ]
  },
  {
    name: 'Elite Custom Site',
    description: 'Fully custom design with e-commerce or interactive elements',
    amount: 250000, // $2,500.00 in cents
    features: [
      'Unlimited Custom Pages',
      'Mobile-Friendly Design',
      'Lead Capture Forms',
      'Custom Branding',
      'Advanced SEO Setup',
      'Social Media Integration',
      'Analytics Integration',
      'E-commerce Integration',
      'Custom Interactive Elements',
      'Priority Support',
      '10 Business Days Delivery'
    ]
  }
];

async function setupStripeProducts() {
  try {
    // Create a product for website packages
    const product = await stripe.products.create({
      name: 'Website Design Packages',
      description: 'Professional website design packages for businesses and individuals',
      metadata: {
        type: 'website_design'
      }
    });

    console.log('Created product:', product.id);

    // Create prices for each package
    for (const pkg of WEBSITE_PACKAGES) {
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: pkg.amount,
        currency: 'usd',
        metadata: {
          features: JSON.stringify(pkg.features)
        }
      });

      console.log(`Created price for ${pkg.name}:`, price.id);
    }

    console.log('Successfully set up all products and prices!');
  } catch (error) {
    console.error('Error setting up Stripe products:', error);
  }
}

setupStripeProducts(); 