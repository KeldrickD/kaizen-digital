"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  FaMoneyBillWave, 
  FaFilter, 
  FaEnvelope, 
  FaDollarSign, 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaLink, 
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaClock
} from 'react-icons/fa';

// Types
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

interface PaymentReminder {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  reminderType: string;
  scheduledFor: string;
  sentAt: string | null;
}

export default function AdminPaymentsPage() {
  // State
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    status: string | null;
    paymentType: string | null;
    search: string;
  }>({
    status: null,
    paymentType: null,
    search: '',
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PaymentData;
    direction: 'asc' | 'desc';
  }>({
    key: 'createdAt',
    direction: 'desc',
  });
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<{id: string, url: string} | null>(null);
  
  // Fetch payments
  useEffect(() => {
    async function fetchPayments() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/payments');
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setErrorMessage('Failed to fetch payments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPayments();
  }, []);
  
  // Fetch reminders
  useEffect(() => {
    async function fetchReminders() {
      try {
        const response = await fetch('/api/admin/payment-reminders');
        const data = await response.json();
        setReminders(data);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    }
    
    fetchReminders();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...payments];
    
    // Apply filters
    if (filter.status) {
      result = result.filter(payment => payment.status === filter.status);
    }
    
    if (filter.paymentType) {
      result = result.filter(payment => payment.paymentType === filter.paymentType);
    }
    
    if (filter.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(payment => 
        payment.customerEmail.toLowerCase().includes(search) ||
        (payment.customerName?.toLowerCase() || '').includes(search) ||
        payment.id.toLowerCase().includes(search) ||
        (payment.description?.toLowerCase() || '').includes(search)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
    
    setPayments(result);
  }, [payments, filter, sortConfig]);
  
  // Handle sort
  const handleSort = (key: keyof PaymentData) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); // Convert cents to dollars
  };
  
  // Generate payment link for remaining balance
  const generatePaymentLink = async (payment: PaymentData) => {
    if (payment.remainingAmount <= 0) return;
    
    setProcessingPayment(payment.id);
    
    try {
      const response = await fetch('/api/payment-links/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: payment.remainingAmount,
          customerEmail: payment.customerEmail,
          customerName: payment.customerName,
          packageType: payment.packageType,
          packageDescription: payment.description,
          originalSessionId: payment.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate payment link');
      }
      
      const { url, id } = await response.json();
      
      // Update payment in database with payment link
      await fetch('/api/payments/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: payment.id,
          paymentUrl: url,
        }),
      });
      
      // Update local state
      setPayments(prevPayments => prevPayments.map(p => 
        p.id === payment.id ? { ...p, paymentUrl: url } : p
      ));
      
      // Show generated link
      setGeneratedLink({ id: payment.id, url });
    } catch (error) {
      console.error('Error generating payment link:', error);
      alert('Failed to generate payment link. Please try again.');
    } finally {
      setProcessingPayment(null);
    }
  };

  // Get payment status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          text: 'Completed',
          icon: <FaCheckCircle />,
          color: 'bg-green-100 text-green-800',
        };
      case 'paid':
        return {
          text: 'Paid',
          icon: <FaDollarSign />,
          color: 'bg-blue-100 text-blue-800',
        };
      case 'pending':
        return {
          text: 'Pending',
          icon: <FaClock />,
          color: 'bg-yellow-100 text-yellow-800',
        };
      default:
        return {
          text: status,
          icon: <FaTimesCircle />,
          color: 'bg-gray-100 text-gray-800',
        };
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Dashboard</h1>

        {/* Payments Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Payments</h2>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                      <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Payment Reminders</h2>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled For
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reminders.map((reminder) => (
                  <tr key={reminder.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reminder.customerName}</div>
                      <div className="text-sm text-gray-500">{reminder.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(reminder.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reminder.reminderType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reminder.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : reminder.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {reminder.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(reminder.scheduledFor), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 