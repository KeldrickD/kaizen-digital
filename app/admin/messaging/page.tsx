"use client";

import { useState, useEffect } from 'react';
import { 
  FaWhatsapp, 
  FaSms, 
  FaEnvelope, 
  FaClock, 
  FaCheckCircle,
  FaTimesCircle,
  FaPaperPlane,
  FaFilter,
  FaPlus
} from 'react-icons/fa';

interface ScheduledMessage {
  id: string;
  recipient: string;
  channel: 'email' | 'whatsapp' | 'sms';
  message: string;
  sendAt: string;
  sent: boolean;
  failed: boolean;
  userId: string;
  createdAt: string;
}

export default function MessagingPage() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterChannel, setFilterChannel] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isComposingMessage, setIsComposingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    channel: 'email' as const,
    message: '',
    sendAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16) // Default to 1 hour from now
  });
  
  useEffect(() => {
    // In a real app, fetch from API
    async function fetchMessages() {
      setIsLoading(true);
      
      // Simulate API fetch
      setTimeout(() => {
        // Generate mock scheduled messages
        const mockMessages: ScheduledMessage[] = Array.from({ length: 12 }, (_, i) => {
          const channel = ['email', 'whatsapp', 'sms'][Math.floor(Math.random() * 3)] as 'email' | 'whatsapp' | 'sms';
          const now = new Date();
          const futureDate = new Date(now.getTime() + (Math.random() * 7 * 86400000)); // 0-7 days in the future
          const pastDate = new Date(now.getTime() - (Math.random() * 7 * 86400000)); // 0-7 days in the past
          const isFuture = Math.random() > 0.5;
          const sent = !isFuture;
          const failed = sent && Math.random() > 0.8; // Some sent messages failed
          
          return {
            id: `msg-${i + 1}`,
            recipient: channel === 'email' 
              ? `contact${i + 1}@example.com` 
              : `+1 555 ${100 + i} ${1000 + i}`,
            channel,
            message: [
              "Thank you for your interest in our web design services! Would you like to schedule a call?",
              "Just following up on your website inquiry. Our team is ready to help when you are!",
              "Your consultation is scheduled for tomorrow. Looking forward to discussing your project!",
              "We noticed you were interested in our Business package. Here's a special offer just for you.",
              "As promised, here is more information about our website maintenance services."
            ][Math.floor(Math.random() * 5)],
            sendAt: (isFuture ? futureDate : pastDate).toISOString(),
            sent,
            failed,
            userId: `user-${Math.floor(Math.random() * 5) + 1}`,
            createdAt: new Date(Math.min(pastDate.getTime(), futureDate.getTime()) - (86400000 * Math.random())).toISOString()
          };
        });
        
        setMessages(mockMessages);
        setIsLoading(false);
      }, 1000);
    }
    
    fetchMessages();
  }, []);
  
  // Apply filters
  const filteredMessages = messages.filter(message => {
    // Channel filter
    if (filterChannel && message.channel !== filterChannel) {
      return false;
    }
    
    // Status filter
    if (filterStatus === 'pending' && message.sent) {
      return false;
    }
    if (filterStatus === 'sent' && (!message.sent || message.failed)) {
      return false;
    }
    if (filterStatus === 'failed' && !message.failed) {
      return false;
    }
    
    return true;
  });
  
  // Handle new message form submission
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newMessage.recipient || !newMessage.message || !newMessage.sendAt) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, send to API
    // For this demo, just add to local state
    const newScheduledMessage: ScheduledMessage = {
      id: `msg-new-${Date.now()}`,
      recipient: newMessage.recipient,
      channel: newMessage.channel,
      message: newMessage.message,
      sendAt: new Date(newMessage.sendAt).toISOString(),
      sent: false,
      failed: false,
      userId: 'current-user',
      createdAt: new Date().toISOString()
    };
    
    setMessages([newScheduledMessage, ...messages]);
    
    // Reset form
    setNewMessage({
      recipient: '',
      channel: 'email',
      message: '',
      sendAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
    });
    
    setIsComposingMessage(false);
  };
  
  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <FaEnvelope className="text-blue-500" />;
      case 'whatsapp':
        return <FaWhatsapp className="text-green-500" />;
      case 'sms':
        return <FaSms className="text-purple-500" />;
      default:
        return null;
    }
  };
  
  // Get status icon and color
  const getStatusInfo = (message: ScheduledMessage) => {
    if (!message.sent) {
      return {
        icon: <FaClock className="text-yellow-500" />,
        text: 'Pending',
        color: 'bg-yellow-100 text-yellow-800'
      };
    }
    
    if (message.failed) {
      return {
        icon: <FaTimesCircle className="text-red-500" />,
        text: 'Failed',
        color: 'bg-red-100 text-red-800'
      };
    }
    
    return {
      icon: <FaCheckCircle className="text-green-500" />,
      text: 'Sent',
      color: 'bg-green-100 text-green-800'
    };
  };
  
  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Message Management</h1>
          <p className="text-gray-600">Schedule and manage follow-up messages across all channels.</p>
        </div>
        <button 
          onClick={() => setIsComposingMessage(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>New Message</span>
        </button>
      </div>
      
      {/* New Message Form */}
      {isComposingMessage && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Compose New Message</h2>
          <form onSubmit={handleMessageSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient
                </label>
                <input
                  type={newMessage.channel === 'email' ? 'email' : 'tel'}
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                  placeholder={newMessage.channel === 'email' ? 'Email address' : 'Phone number'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {newMessage.channel === 'email' 
                    ? 'Enter a valid email address' 
                    : newMessage.channel === 'whatsapp'
                      ? 'Enter a phone number with country code (e.g., +1 555 123 4567)'
                      : 'Enter a phone number with country code (e.g., +1 555 123 4567)'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel
                </label>
                <select
                  value={newMessage.channel}
                  onChange={(e) => setNewMessage({...newMessage, channel: e.target.value as 'email' | 'whatsapp' | 'sms'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({...newMessage, message: e.target.value})}
                  placeholder="Enter your message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send Time
                </label>
                <input
                  type="datetime-local"
                  value={newMessage.sendAt}
                  onChange={(e) => setNewMessage({...newMessage, sendAt: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => setIsComposingMessage(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <FaPaperPlane />
                <span>Schedule Message</span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <select
              value={filterChannel || ''}
              onChange={(e) => setFilterChannel(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Channels</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="w-full sm:w-auto">
            <button
              onClick={() => {
                setFilterChannel(null);
                setFilterStatus(null);
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-700">Loading messages...</p>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Send Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => {
                  const statusInfo = getStatusInfo(message);
                  const isPending = !message.sent;
                  const sendDate = new Date(message.sendAt);
                  const isFuture = sendDate > new Date();
                  
                  return (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getChannelIcon(message.channel)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">
                            {message.channel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{message.recipient}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {message.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sendDate.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sendDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {isFuture && (
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.ceil((sendDate.getTime() - Date.now()) / (1000 * 60 * 60))} hours from now
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
                          <span className="mr-1">{statusInfo.icon}</span>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                            View
                          </button>
                          {isPending && (
                            <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                              Cancel
                            </button>
                          )}
                          {message.failed && (
                            <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                              Retry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            <FaFilter className="mx-auto text-4xl mb-4 text-gray-400" />
            <p>No messages match your filters. Try adjusting your criteria or create a new message.</p>
          </div>
        )}
      </div>
    </div>
  );
} 