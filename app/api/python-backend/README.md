# Payment Processing API for Chat Widget

This is a Flask-based API backend that handles payment options for the Kaizen Digital Design chat widget. It generates Stripe payment links, tracks payment status, and logs user interactions.

## Features

- Generate dynamic Stripe payment links for deposit and full payment options
- Track payment status in Firebase or Google Sheets
- Record user interactions and lead data
- Handle Stripe webhooks for payment confirmations
- Send automated follow-ups for unpaid leads and incomplete payments
- Provide intake forms after successful payment

## Setup Instructions

### Prerequisites

- Python 3.9 or higher
- A Stripe account with API keys
- Firebase project (optional) or Google Sheets API access (optional)

### Local Development

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file based on `.env.example` and add your credentials:
   ```
   cp .env.example .env
   ```

3. Run the development server:
   ```
   python app.py
   ```

### Setting up Stripe

1. Create a Stripe account and get your API keys from the Stripe Dashboard
2. Update your `.env` file with your Stripe secret key
3. Set up a webhook in your Stripe Dashboard that points to `https://your-domain.com/webhook`
4. Add the webhook secret to your `.env` file

### Data Storage Options

This API supports multiple storage backends:

#### Option 1: Firebase Firestore

1. Create a Firebase project and enable Firestore
2. Generate a service account key from Firebase console
3. Add the JSON key (as a string) to your `.env` file as `FIREBASE_CREDENTIALS`

#### Option 2: Google Sheets

1. Create a Google Service Account with access to Google Sheets API
2. Share a Google Sheet with your service account email
3. Add the JSON key (as a string) to your `.env` file as `GOOGLE_CREDENTIALS`
4. Set `GOOGLE_SHEET_NAME` to the name of your sheet
5. Make sure your sheet has two tabs: "Sheet1" for payments and "Interactions" for tracking

#### Option 3: Local File Storage (Fallback)

If neither Firebase nor Google Sheets credentials are provided, the app will fall back to local file storage in a `data` directory. This is only recommended for testing.

## Deployment

### Deploy to Cloud Run (Recommended)

1. Build the Docker image:
   ```
   docker build -t payment-api .
   ```

2. Tag and push to Google Container Registry:
   ```
   docker tag payment-api gcr.io/your-project-id/payment-api
   docker push gcr.io/your-project-id/payment-api
   ```

3. Deploy to Cloud Run:
   ```
   gcloud run deploy payment-api --image gcr.io/your-project-id/payment-api --platform managed
   ```

### Deploy to Heroku

1. Create a Heroku app:
   ```
   heroku create your-app-name
   ```

2. Add your environment variables:
   ```
   heroku config:set STRIPE_SECRET_KEY=sk_... STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. Push to Heroku:
   ```
   git push heroku main
   ```

## API Endpoints

- `POST /api/payment-options/create` - Generate payment links
- `GET /api/payment-options/status` - Check payment status
- `POST /api/payment-options/interaction` - Record user interaction
- `GET /api/payment-success` - Handle successful payment redirect
- `POST /webhook` - Stripe webhook endpoint

## Integration with Chat Widget

In your Next.js app, configure the frontend to use this API by setting the `PAYMENT_API_URL` variable in the ChatWidget component.

## License

This project is proprietary to Kaizen Digital Design. 