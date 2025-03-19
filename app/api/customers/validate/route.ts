import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// In a real application, you would use a database
// This is a simple mock for demonstration purposes
const mockCustomers = [
  {
    id: 'cust_123',
    name: 'Demo Customer',
    email: 'customer@example.com',
    // This is the hashed version of "password123" - in a real app, never store plain text passwords
    passwordHash: '$2a$10$HMd1W5NFzkXbxQfegKjFXO5xpyg/gEDcEyGSoQaYt/TOaXwV5mAse',
    stripeCustomerId: 'cus_XXXXXXXX',
    companyName: 'Demo Company',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }
    
    // Find the customer by email
    const customer = mockCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    // If customer not found or password doesn't match
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password using bcrypt
    const passwordValid = await bcrypt.compare(password, customer.passwordHash);
    
    if (!passwordValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Return the customer data (without the password hash)
    const { passwordHash, ...customerData } = customer;
    return NextResponse.json({ 
      success: true,
      customer: customerData
    });
    
  } catch (error: any) {
    console.error('Error validating customer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 