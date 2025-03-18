"use client";

import { useState, useEffect } from 'react';
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

export default function PaymentsPage() {
  // State
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentData[]>([]);
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
        const response = await fetch('/api/payments/store');
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
    
    setFilteredPayments(result);
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
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Track payments and manage remaining balances</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <select
              value={filter.status || ''}
              onChange={(e) => setFilter({ ...filter, status: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <select
              value={filter.paymentType || ''}
              onChange={(e) => setFilter({ ...filter, paymentType: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Payment Types</option>
              <option value="full">Full Payment</option>
              <option value="deposit">Deposit</option>
              <option value="remaining_balance">Remaining Balance</option>
            </select>
          </div>
          
          <div className="w-full sm:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                placeholder="Search by email, name..."
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="w-full sm:w-auto">
            <button
              onClick={() => setFilter({ status: null, paymentType: null, search: '' })}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment Link Modal */}
      {generatedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Payment Link Generated</h2>
              <button 
                onClick={() => setGeneratedLink(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="mb-2">
                The payment link for the remaining balance has been generated successfully.
              </p>
              <div className="border rounded p-3 bg-gray-50 break-all">
                <a 
                  href={generatedLink.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {generatedLink.url}
                </a>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink.url);
                  alert('Payment link copied to clipboard!');
                }}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                <FaLink className="mr-2" /> Copy Link
              </button>
              
              <button
                onClick={() => {
                  window.open(`mailto:?subject=Complete Your Website Payment&body=Please use this link to complete your remaining payment: ${generatedLink.url}`);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FaEnvelope className="mr-2" /> Send via Email
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-700">Loading payment data...</p>
          </div>
        ) : errorMessage ? (
          <div className="py-20 text-center text-red-500">
            <p>{errorMessage}</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <FaMoneyBillWave className="mx-auto text-4xl mb-4 text-gray-400" />
            <p>No payments found. Adjust your filters or check back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {sortConfig.key === 'createdAt' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('customerEmail')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Customer</span>
                      {sortConfig.key === 'customerEmail' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortConfig.key === 'status' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      {sortConfig.key === 'amount' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const statusBadge = getStatusBadge(payment.status);
                  const hasRemainingBalance = payment.paymentType === 'deposit' && payment.remainingAmount > 0;
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(payment.createdAt)}</div>
                        <div className="text-xs text-gray-500">{payment.id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{payment.customerName || 'Unknown'}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaEnvelope className="text-gray-400 mr-1" /> {payment.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{payment.description || payment.packageType}</div>
                        <div className="text-xs text-gray-500 capitalize">{payment.paymentType.replace('_', ' ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                          <span className="mr-1">{statusBadge.icon}</span>
                          <span>{statusBadge.text}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                        {hasRemainingBalance && (
                          <div className="text-xs text-red-500">
                            Remaining: {formatCurrency(payment.remainingAmount)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {hasRemainingBalance && payment.status === 'paid' && (
                            <>
                              {payment.paymentUrl ? (
                                <a
                                  href={payment.paymentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                                >
                                  <FaLink className="mr-1" /> Payment Link
                                </a>
                              ) : (
                                <button
                                  onClick={() => generatePaymentLink(payment)}
                                  disabled={!!processingPayment}
                                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                                >
                                  {processingPayment === payment.id ? (
                                    <>
                                      <FaSpinner className="mr-1 animate-spin" /> Processing...
                                    </>
                                  ) : (
                                    <>
                                      <FaCreditCard className="mr-1" /> Generate Link
                                    </>
                                  )}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 