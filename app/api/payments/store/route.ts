import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Path to our payments database file
const dbPath = path.join(process.cwd(), 'data', 'payments.json');

// TypeScript interface for payment data
interface PaymentData {
  id: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
  remainingAmount: number;
  paymentType: 'full' | 'deposit' | 'remaining_balance';
  packageType: string;
  status: 'paid' | 'pending' | 'completed';
  paymentUrl?: string;
  createdAt: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Ensure the data directory exists
async function ensureDataDirectoryExists() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Get all payments from our database
async function getPayments(): Promise<PaymentData[]> {
  await ensureDataDirectoryExists();
  
  try {
    const fileContents = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error) {
    // If file doesn't exist yet, return empty array
    return [];
  }
}

// Save payments to our database
async function savePayments(payments: PaymentData[]): Promise<void> {
  await ensureDataDirectoryExists();
  await fs.writeFile(dbPath, JSON.stringify(payments, null, 2), 'utf-8');
}

// Create a new payment record
export async function POST(request: Request) {
  try {
    const paymentData: Omit<PaymentData, 'createdAt'> = await request.json();
    
    if (!paymentData.id || !paymentData.customerEmail || !paymentData.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Add creation timestamp
    const newPayment: PaymentData = {
      ...paymentData,
      createdAt: new Date().toISOString()
    };
    
    // Get existing payments
    const payments = await getPayments();
    
    // Check if payment already exists
    const paymentExists = payments.some(p => p.id === newPayment.id);
    if (paymentExists) {
      return NextResponse.json(
        { error: 'Payment with this ID already exists' },
        { status: 409 }
      );
    }
    
    // Add new payment
    payments.push(newPayment);
    
    // Save updated payment list
    await savePayments(payments);
    
    return NextResponse.json({ success: true, payment: newPayment });
  } catch (error: any) {
    console.error('Error storing payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to store payment' },
      { status: 500 }
    );
  }
}

// Get all payments or filtered by status/email
export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const email = url.searchParams.get('email');
    const paymentType = url.searchParams.get('paymentType');
    
    // Get all payments
    let payments = await getPayments();
    
    // Apply filters if provided
    if (status) {
      payments = payments.filter(p => p.status === status);
    }
    
    if (email) {
      payments = payments.filter(p => p.customerEmail === email);
    }
    
    if (paymentType) {
      payments = payments.filter(p => p.paymentType === paymentType);
    }
    
    return NextResponse.json(payments);
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// Update payment information (e.g., mark as complete, add payment URL)
export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }
    
    // Get existing payments
    const payments = await getPayments();
    
    // Find the payment to update
    const paymentIndex = payments.findIndex(p => p.id === id);
    
    if (paymentIndex === -1) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Update the payment
    payments[paymentIndex] = {
      ...payments[paymentIndex],
      ...updateData,
    };
    
    // Save updated payment list
    await savePayments(payments);
    
    return NextResponse.json({ success: true, payment: payments[paymentIndex] });
  } catch (error: any) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update payment' },
      { status: 500 }
    );
  }
} 