// Setup script for creating Stripe products and prices in production
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProduct(name, description, metadata = {}) {
  try {
    const product = await stripe.products.create({
      name,
      description,
      metadata,
    });
    console.log(`Created product: ${product.id} (${name})`);
    return product;
  } catch (error) {
    console.error(`Error creating product ${name}:`, error);
    throw error;
  }
}

async function createPrice(productId, unitAmount, currency = 'usd', recurring = null) {
  try {
    const priceData = {
      product: productId,
      unit_amount: unitAmount,
      currency,
    };

    if (recurring) {
      priceData.recurring = recurring;
    }

    const price = await stripe.prices.create(priceData);
    console.log(`Created price: ${price.id} ($${unitAmount / 100})`);
    return price;
  } catch (error) {
    console.error(`Error creating price for product ${productId}:`, error);
    throw error;
  }
}

async function setupProductsAndPrices() {
  try {
    console.log('Setting up products and prices in PRODUCTION mode...');
    
    // Website Packages
    const starterProduct = await createProduct(
      'Starter Site',
      '3-page professional site with mobile-friendly design',
      { type: 'website' }
    );
    
    const businessProduct = await createProduct(
      'Business Pro',
      '5-page website with lead capture form & custom branding',
      { type: 'website' }
    );
    
    const eliteProduct = await createProduct(
      'Elite Custom Site',
      'Fully custom design with e-commerce or interactive elements',
      { type: 'website' }
    );

    // Create one-time prices
    const starterPrice = await createPrice(starterProduct.id, 75000); // $750
    const businessPrice = await createPrice(businessProduct.id, 150000); // $1,500
    const elitePrice = await createPrice(eliteProduct.id, 250000); // $2,500

    // Print price IDs for .env file
    console.log('\n--- Add these to your .env.production file ---');
    console.log(`STRIPE_STARTER_PRICE_ID=${starterPrice.id}`);
    console.log(`STRIPE_BUSINESS_PRICE_ID=${businessPrice.id}`);
    console.log(`STRIPE_ELITE_PRICE_ID=${elitePrice.id}`);
    console.log('-------------------------------------------\n');

    console.log('Successfully set up all products and prices!');
  } catch (error) {
    console.error('Error setting up products and prices:', error);
  }
}

// Run the setup
setupProductsAndPrices(); 