import { NextRequest, NextResponse } from 'next/server';

// The URL where your Python backend is deployed
const PAYMENT_API_URL = process.env.PAYMENT_API_URL || 'https://payment-api.your-domain.com';

// Create payment links API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the Python backend
    const response = await fetch(`${PAYMENT_API_URL}/api/payment-options/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Handle errors
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to generate payment links' },
        { status: response.status }
      );
    }
    
    // Return the payment links
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in payment-options API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 