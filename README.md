# Kaizen Digital Design

A professional landing page for web design services with Stripe payment integration.

## Features

- High-converting landing page with modern design
- Stripe payment processing integration
- Client intake form automation
- Responsive design for all devices
- 48-hour website delivery promise

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 3
- Stripe API

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Stripe account with API keys

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/KeldrickD/kaizen-digital.git
   cd kaizen-digital
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables
   - Copy `.env.local.example` to `.env.local`
   - Add your Stripe API keys:
     ```
     STRIPE_PUBLIC_KEY=pk_test_your_key
     STRIPE_SECRET_KEY=sk_test_your_key
     ```

4. Run the development server
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## Deployment

Deploy the app on Vercel for the best experience:

```bash
npm install -g vercel
vercel
```

## Configuration

To update the pricing or service offerings, edit the `pricingTiers` array in `app/components/PricingSection.tsx`. 