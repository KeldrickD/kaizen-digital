import { NextRequest, NextResponse } from 'next/server';

// The URL where your Python backend is deployed
const PAYMENT_API_URL = process.env.PAYMENT_API_URL || 'https://payment-api.your-domain.com';

// Get payment status API route
export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }
    
    // Forward the request to the Python backend
    const response = await fetch(
      `${PAYMENT_API_URL}/api/payment-options/status?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Handle errors
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to get payment status' },
        { status: response.status }
      );
    }
    
    // Return the payment status
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in payment-status API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 