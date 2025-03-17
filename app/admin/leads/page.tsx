"use client";

import { useState, useEffect } from 'react';
import { 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaFilter, 
  FaSearch,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp
} from 'react-icons/fa';

interface Lead {
  id: string;
  email?: string;
  phone?: string;
  preferredChannel?: 'email' | 'whatsapp' | 'sms';
  qualification: {
    hasWebsite: boolean | null;
    mainGoal: string | null;
    timeline: string | null;
    budget: string | null;
    industry: string | null;
    qualified: boolean;
  };
  score: number;
  createdAt: string;
  updatedAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Lead>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterQualified, setFilterQualified] = useState<boolean | null>(null);
  const [filterIndustry, setFilterIndustry] = useState<string | null>(null);
  const [filterTimeline, setFilterTimeline] = useState<string | null>(null);
  
  // Mock data for demo purposes
  // In a real app, fetch this from the API
  const industries = ["E-commerce", "Professional Services", "Healthcare", "Real Estate", "Other"];
  const timelines = ["ASAP", "Within 1 month", "Within 3 months", "Just exploring"];
  
  useEffect(() => {
    // Simulate API fetch with timeout
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock lead data
      const mockLeads: Lead[] = Array.from({ length: 15 }, (_, i) => {
        const hasWebsite = Math.random() > 0.5;
        const mainGoal = ["Get more customers", "Sell products online", "Build brand awareness"][Math.floor(Math.random() * 3)];
        const timeline = timelines[Math.floor(Math.random() * timelines.length)];
        const industry = industries[Math.floor(Math.random() * industries.length)];
        const qualified = Math.random() > 0.4;
        const score = Math.floor(Math.random() * 100);
        const created = new Date(Date.now() - Math.random() * 30 * 86400000); // Random date within last 30 days
        
        return {
          id: `lead-${i + 1}`,
          email: `lead${i + 1}@example.com`,
          phone: i % 3 === 0 ? `+1 555-${100 + i}-${1000 + i}` : undefined,
          preferredChannel: ["email", "whatsapp", "sms"][Math.floor(Math.random() * 3)] as 'email' | 'whatsapp' | 'sms',
          qualification: {
            hasWebsite,
            mainGoal,
            timeline,
            budget: ["Basic", "Business", "Enterprise"][Math.floor(Math.random() * 3)],
            industry,
            qualified
          },
          score,
          createdAt: created.toISOString(),
          updatedAt: new Date(created.getTime() + Math.random() * 5 * 86400000).toISOString() // 0-5 days after creation
        };
      });
      
      setLeads(mockLeads);
      setIsLoading(false);
    }, 1000);
    
    // In a real app, fetch from API
    // async function fetchLeads() {
    //   try {
    //     const response = await fetch('/api/leads/store');
    //     const data = await response.json();
    //     if (data.success) {
    //       setLeads(data.leads);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching leads:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    // 
    // fetchLeads();
    
  }, []);
  
  // Handle sorting
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new sort field
    }
  };
  
  // Apply filters and sorting
  const filteredAndSortedLeads = leads
    .filter(lead => {
      // Search filter
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        return (
          (lead.email?.toLowerCase().includes(lowercaseSearch) || false) ||
          (lead.phone?.toLowerCase().includes(lowercaseSearch) || false) ||
          (lead.qualification.industry?.toLowerCase().includes(lowercaseSearch) || false) ||
          (lead.qualification.mainGoal?.toLowerCase().includes(lowercaseSearch) || false)
        );
      }
      return true;
    })
    .filter(lead => {
      // Qualified filter
      if (filterQualified !== null) {
        return lead.qualification.qualified === filterQualified;
      }
      return true;
    })
    .filter(lead => {
      // Industry filter
      if (filterIndustry) {
        return lead.qualification.industry === filterIndustry;
      }
      return true;
    })
    .filter(lead => {
      // Timeline filter
      if (filterTimeline) {
        return lead.qualification.timeline === filterTimeline;
      }
      return true;
    })
    .sort((a, b) => {
      // Special case for nested properties
      if (sortField === 'qualification') {
        // This would need more specific logic based on what qualification field to sort by
        return 0;
      }
      
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      // Handle date strings
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lead Management</h1>
        <p className="text-gray-600">View, filter, and manage all your leads in one place.</p>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Qualified filter */}
          <div className="w-full sm:w-auto">
            <select
              value={filterQualified === null ? '' : filterQualified ? 'qualified' : 'unqualified'}
              onChange={(e) => {
                if (e.target.value === '') setFilterQualified(null);
                else setFilterQualified(e.target.value === 'qualified');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Leads</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
            </select>
          </div>
          
          {/* Industry filter */}
          <div className="w-full sm:w-auto">
            <select
              value={filterIndustry || ''}
              onChange={(e) => setFilterIndustry(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          
          {/* Timeline filter */}
          <div className="w-full sm:w-auto">
            <select
              value={filterTimeline || ''}
              onChange={(e) => setFilterTimeline(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Timelines</option>
              {timelines.map(timeline => (
                <option key={timeline} value={timeline}>{timeline}</option>
              ))}
            </select>
          </div>
          
          {/* Clear filters */}
          <div className="w-full sm:w-auto">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterQualified(null);
                setFilterIndustry(null);
                setFilterTimeline(null);
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Leads table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-700">Loading leads...</p>
          </div>
        ) : filteredAndSortedLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Score</span>
                      {sortField === 'score' ? (
                        sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Contact</span>
                      {sortField === 'email' ? (
                        sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span>Qualification</span>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {sortField === 'createdAt' ? (
                        sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white ${lead.score >= 70 ? 'bg-green-500' : lead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {lead.score}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      )}
                      {lead.preferredChannel && (
                        <div className="mt-1 flex">
                          {lead.preferredChannel === 'email' && <FaEnvelope className="text-blue-500 mr-1" />}
                          {lead.preferredChannel === 'whatsapp' && <FaWhatsapp className="text-green-500 mr-1" />}
                          {lead.preferredChannel === 'sms' && <FaPhoneAlt className="text-purple-500 mr-1" />}
                          <span className="text-xs text-gray-500">{lead.preferredChannel}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex space-x-1">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {lead.qualification.hasWebsite ? 'Has Website' : 'Needs Website'}
                          </span>
                          {lead.qualification.qualified && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Qualified
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Goal:</span> {lead.qualification.mainGoal || 'Not specified'}
                        </div>
                        {lead.qualification.industry && (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Industry:</span> {lead.qualification.industry}
                          </div>
                        )}
                        {lead.qualification.timeline && (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Timeline:</span> {lead.qualification.timeline}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Created: {new Date(lead.createdAt).toLocaleDateString()}</div>
                      <div>Updated: {new Date(lead.updatedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                          View
                        </button>
                        <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                          Contact
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            <FaFilter className="mx-auto text-4xl mb-4 text-gray-400" />
            <p>No leads match your filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 