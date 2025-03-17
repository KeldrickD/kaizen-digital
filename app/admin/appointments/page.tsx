"use client";

import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaCalendarTimes, 
  FaUserClock,
  FaClock,
  FaFilter,
  FaEnvelope,
  FaPhoneAlt,
  FaSortDown,
  FaSortUp,
  FaSort
} from 'react-icons/fa';

interface Appointment {
  id: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  date: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  packageInterest?: string;
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPackage, setFilterPackage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Appointment>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  
  // Mock packages
  const packages = ["Basic", "Business", "Enterprise", "Custom"];
  
  useEffect(() => {
    // In a real app, fetch from API
    async function fetchAppointments() {
      setIsLoading(true);
      
      // Simulate API fetch with timeout
      setTimeout(() => {
        // Mock appointment data
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(9, 0, 0, 0);
        
        const mockAppointments: Appointment[] = Array.from({ length: 10 }, (_, i) => {
          // Generate dates: some in the past, some in the future
          const isInFuture = i < 6; // 60% future appointments, 40% past
          
          const appointmentDate = new Date(startOfDay);
          if (isInFuture) {
            appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days in future
          } else {
            appointmentDate.setDate(appointmentDate.getDate() - Math.floor(Math.random() * 30) + 1); // 1-30 days in past
          }
          
          // Random time between 9 AM and 5 PM
          appointmentDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0, 0);
          
          // Status based on date
          let status: Appointment['status'] = 'scheduled';
          if (!isInFuture) {
            const statuses: Appointment['status'][] = ['completed', 'cancelled', 'no-show'];
            status = statuses[Math.floor(Math.random() * statuses.length)];
          }
          
          // Random package interest
          const packageInterest = packages[Math.floor(Math.random() * packages.length)];
          
          // Create the appointment
          return {
            id: `appt-${i + 1}`,
            leadName: `Client ${i + 1}`,
            leadEmail: `client${i + 1}@example.com`,
            leadPhone: Math.random() > 0.3 ? `+1 555-${100 + i}-${1000 + i}` : undefined,
            date: appointmentDate.toISOString(),
            duration: [30, 45, 60][Math.floor(Math.random() * 3)],
            status,
            notes: Math.random() > 0.5 ? 
              [
                "Client needs a complete website redesign",
                "Interested in e-commerce functionality",
                "Looking for SEO optimization",
                "Wants to discuss ongoing maintenance",
                "Budget constrained, needs affordable options"
              ][Math.floor(Math.random() * 5)] : undefined,
            packageInterest,
            createdAt: new Date(appointmentDate.getTime() - (86400000 * (Math.random() * 7 + 1))).toISOString() // 1-8 days before appointment
          };
        });
        
        setAppointments(mockAppointments);
        setIsLoading(false);
      }, 1000);
    }
    
    fetchAppointments();
  }, []);
  
  // Handle sorting
  const handleSort = (field: keyof Appointment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Apply filters and sorting
  const filteredAndSortedAppointments = appointments
    .filter(appointment => {
      // Status filter
      if (filterStatus && appointment.status !== filterStatus) {
        return false;
      }
      
      // Package filter
      if (filterPackage && appointment.packageInterest !== filterPackage) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Most sort fields are strings that need to be compared appropriately
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle sorting dates
      if (sortField === 'date' || sortField === 'createdAt') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      // Handle string sort
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Handle numeric sort
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  
  // Get status badge styling
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return {
          icon: <FaClock />,
          color: 'bg-blue-100 text-blue-800'
        };
      case 'completed':
        return {
          icon: <FaCalendarCheck />,
          color: 'bg-green-100 text-green-800'
        };
      case 'cancelled':
        return {
          icon: <FaCalendarTimes />,
          color: 'bg-red-100 text-red-800'
        };
      case 'no-show':
        return {
          icon: <FaUserClock />,
          color: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          icon: <FaClock />,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };
  
  // Handle view details
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewingDetails(true);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Consultation Calendar</h1>
        <p className="text-gray-600">Manage your scheduled consultations with leads.</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No-Show</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <select
              value={filterPackage || ''}
              onChange={(e) => setFilterPackage(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Packages</option>
              {packages.map(pkg => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="w-full sm:w-auto">
            <button
              onClick={() => {
                setFilterStatus(null);
                setFilterPackage(null);
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-700">Loading appointments...</p>
          </div>
        ) : filteredAndSortedAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date & Time</span>
                      {sortField === 'date' ? (
                        sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('leadName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Lead</span>
                      {sortField === 'leadName' ? (
                        sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' ? (
                        sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('packageInterest')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Package</span>
                      {sortField === 'packageInterest' ? (
                        sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedAppointments.map((appointment) => {
                  const statusBadge = getStatusBadge(appointment.status);
                  const appointmentDate = new Date(appointment.date);
                  const isPast = appointmentDate < new Date();
                  
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(appointment.date)}
                        </div>
                        {!isPast && (
                          <div className="text-xs text-gray-500">
                            {Math.ceil((appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 1
                              ? 'Today/Tomorrow'
                              : `In ${Math.ceil((appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`
                            }
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{appointment.leadName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaEnvelope className="text-gray-400 mr-1" /> {appointment.leadEmail}
                        </div>
                        {appointment.leadPhone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaPhoneAlt className="text-gray-400 mr-1" /> {appointment.leadPhone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.duration} minutes</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                          <span className="mr-1">{statusBadge.icon}</span>
                          <span className="capitalize">{appointment.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.packageInterest || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleViewDetails(appointment)}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            View
                          </button>
                          {appointment.status === 'scheduled' && (
                            <>
                              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                                Complete
                              </button>
                              <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                                Cancel
                              </button>
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
        ) : (
          <div className="py-20 text-center text-gray-500">
            <FaFilter className="mx-auto text-4xl mb-4 text-gray-400" />
            <p>No appointments match your filters. Try adjusting your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Appointment Details Modal */}
      {isViewingDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
              <button 
                onClick={() => setIsViewingDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Lead Information</h3>
                <p className="text-base font-medium text-gray-900">{selectedAppointment.leadName}</p>
                <p className="text-sm text-gray-600">{selectedAppointment.leadEmail}</p>
                {selectedAppointment.leadPhone && (
                  <p className="text-sm text-gray-600">{selectedAppointment.leadPhone}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Appointment Details</h3>
                <p className="text-base font-medium text-gray-900">{formatDate(selectedAppointment.date)}</p>
                <p className="text-sm text-gray-600">{selectedAppointment.duration} minutes</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(selectedAppointment.status).color}`}>
                    <span className="mr-1">{getStatusBadge(selectedAppointment.status).icon}</span>
                    <span className="capitalize">{selectedAppointment.status}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Package Interest</h3>
              <p className="text-base text-gray-900">{selectedAppointment.packageInterest || 'Not specified'}</p>
            </div>
            
            {selectedAppointment.notes && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                <p className="text-base text-gray-900 p-3 bg-gray-50 rounded-md">{selectedAppointment.notes}</p>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Actions</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAppointment.status === 'scheduled' ? (
                  <>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Mark as Completed
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                      Cancel Appointment
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                      Mark as No-Show
                    </button>
                  </>
                ) : (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Reschedule Appointment
                  </button>
                )}
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Send Reminder
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  Edit Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 