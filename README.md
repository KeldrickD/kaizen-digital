# Kaizen Digital Design

A professional landing page for web design services with Stripe payment integration.

## Features

- High-converting landing page with modern design
- Stripe payment processing integration
- Client intake form automation
- Responsive design for all devices
- 48-hour website delivery promise
- AI-powered chat widget with dynamic payment options

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 3
- Stripe API
- Python (Flask) backend for payment processing
- Firebase/Google Sheets for lead tracking

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Stripe account with API keys
- Python 3.9+ (for backend deployment)

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
     PAYMENT_API_URL=https://your-payment-api-url.com
     ```

4. Run the development server
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## Payment Processing Backend

This project includes a Python Flask backend for handling dynamic payment options:

1. Navigate to the Python backend directory:
   ```bash
   cd app/api/python-backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your backend environment:
   - Copy `.env.example` to `.env`
   - Add your Stripe credentials and other settings

4. Deploy the backend:
   - See detailed instructions in `app/api/python-backend/README.md`
   - You can deploy to Cloud Run, Heroku, or other services

5. Update your `.env.local` file with the deployed backend URL:
   ```
   PAYMENT_API_URL=https://your-deployed-api.com
   ```

## Chat Widget Features

The enhanced chat widget offers:

- Intelligent conversation flow to guide users to payment
- Dynamic payment options (deposit or full payment)
- Automatic follow-up system for leads and partial payments
- Lead tracking and conversion analytics
- Integration with Firebase or Google Sheets

To configure the chat widget, edit `app/components/ChatWidget.tsx`. For the backend integration, follow the instructions in the backend README.

## Deployment

Deploy the app on Vercel for the best experience:

```bash
npm install -g vercel
vercel
```

## Configuration

To update the pricing or service offerings, edit the `pricingTiers` array in `app/components/PricingSection.tsx`. 

To modify the chat widget's behavior, edit the conversation flows in `app/components/ChatWidget.tsx`. 