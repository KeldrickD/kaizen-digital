"use client";

import { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUserCheck, 
  FaChartLine, 
  FaComment, 
  FaWhatsapp, 
  FaSms,
  FaEnvelope,
  FaCalendarCheck,
  FaExclamationTriangle
} from 'react-icons/fa';

interface LeadStats {
  total: number;
  qualified: number;
  highValue: number;
  conversionRate: string;
}

interface MessageStats {
  total: {
    pending: number;
    sent: number;
    failed: number;
  };
  channels: {
    email: number;
    whatsapp: number;
    sms: number;
  };
}

export default function Dashboard() {
  const [leadStats, setLeadStats] = useState<LeadStats>({
    total: 0,
    qualified: 0,
    highValue: 0,
    conversionRate: '0%'
  });
  
  const [messageStats, setMessageStats] = useState<MessageStats>({
    total: {
      pending: 0,
      sent: 0,
      failed: 0
    },
    channels: {
      email: 0,
      whatsapp: 0,
      sms: 0
    }
  });
  
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch lead statistics
        const leadResponse = await fetch('/api/leads/store');
        const leadData = await leadResponse.json();
        
        if (leadData.success) {
          setLeadStats(leadData.stats);
        }
        
        // Fetch message statistics
        const messageResponse = await fetch('/api/messaging/schedule');
        const messageData = await messageResponse.json();
        
        if (messageData.success) {
          // In a real application, you would map the API response to your state structure
          setMessageStats({
            total: {
              pending: messageData.stats.pending || 0,
              sent: messageData.stats.sent || 0,
              failed: 0 // This would come from your API
            },
            channels: {
              email: 0, // These would come from your API
              whatsapp: 0,
              sms: 0
            }
          });
        }
        
        // For demo purposes, generate some fake recent leads
        // In a real application, this would come from your API
        setRecentLeads([
          {
            id: '1',
            date: new Date().toISOString(),
            email: 'j***@example.com',
            qualification: {
              hasWebsite: true,
              mainGoal: 'Get more customers',
              timeline: 'ASAP',
              industry: 'E-commerce',
              qualified: true
            },
            score: 85
          },
          {
            id: '2',
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            email: 's***@company.com',
            qualification: {
              hasWebsite: false,
              mainGoal: 'Build brand awareness',
              timeline: 'Within 3 months',
              industry: 'Professional Services',
              qualified: false
            },
            score: 45
          },
          {
            id: '3',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            email: 't***@healthcare.org',
            qualification: {
              hasWebsite: true,
              mainGoal: 'Sell products online',
              timeline: 'Within 1 month',
              industry: 'Healthcare',
              qualified: true
            },
            score: 70
          }
        ]);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    
    // Set up interval to refresh data every minute
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center text-red-600">
          <FaExclamationTriangle className="inline-block text-4xl mb-2" />
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Leads"
            value={leadStats.total}
            icon={<FaUsers className="text-blue-500" />}
          />
          <StatCard
            title="Qualified Leads"
            value={leadStats.qualified}
            icon={<FaUserCheck className="text-green-500" />}
          />
          <StatCard
            title="High-Value Leads"
            value={leadStats.highValue}
            icon={<FaChartLine className="text-purple-500" />}
          />
          <StatCard
            title="Conversion Rate"
            value={leadStats.conversionRate}
            icon={<FaCalendarCheck className="text-orange-500" />}
          />
        </div>
        
        {/* Message Stats */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Messaging Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Pending Messages"
            value={messageStats.total.pending}
            icon={<FaComment className="text-yellow-500" />}
          />
          <StatCard
            title="Sent Messages"
            value={messageStats.total.sent}
            icon={<FaComment className="text-green-500" />}
          />
          <StatCard
            title="Failed Messages"
            value={messageStats.total.failed}
            icon={<FaComment className="text-red-500" />}
          />
        </div>
        
        {/* Recent Leads */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Leads</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          {recentLeads.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentLeads.map((lead) => (
                <li key={lead.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white ${lead.score >= 70 ? 'bg-green-500' : lead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                          {lead.score}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Industry:</span> {lead.qualification.industry || 'Not specified'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(lead.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Goal: {lead.qualification.mainGoal || 'Not specified'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {lead.qualification.hasWebsite ? 'Has Website' : 'Needs Website'}
                          </span>
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {lead.qualification.timeline || 'No Timeline'}
                          </span>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.qualification.qualified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {lead.qualification.qualified ? 'Qualified' : 'Not Qualified'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              No leads found.
            </div>
          )}
        </div>
        
        {/* Channel Analysis */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Communication Channel Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ChannelCard
            title="Email"
            value={messageStats.channels.email}
            icon={<FaEnvelope className="text-blue-500" />}
          />
          <ChannelCard
            title="WhatsApp"
            value={messageStats.channels.whatsapp}
            icon={<FaWhatsapp className="text-green-500" />}
          />
          <ChannelCard
            title="SMS"
            value={messageStats.channels.sms}
            icon={<FaSms className="text-purple-500" />}
          />
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-2xl">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

// Channel Card Component
function ChannelCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-2xl">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title} Messages</dt>
              <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className={`absolute h-2 rounded-full ${
                title === 'Email' ? 'bg-blue-500' : 
                title === 'WhatsApp' ? 'bg-green-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(value * 5, 100)}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {Math.min(value * 5, 100)}% of total messages
          </div>
        </div>
      </div>
    </div>
  );
} 