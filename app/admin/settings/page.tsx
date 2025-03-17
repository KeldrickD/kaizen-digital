"use client";

import { useState } from 'react';
import { 
  FaSave, 
  FaEnvelope, 
  FaWhatsapp, 
  FaSms, 
  FaCalendarAlt,
  FaBell,
  FaUser,
  FaLock
} from 'react-icons/fa';

export default function SettingsPage() {
  // Communication channel settings
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    fromEmail: 'contact@kaizen-digital.com',
    fromName: 'Kaizen Digital',
    serviceProvider: 'SendGrid'
  });
  
  const [smsSettings, setSmsSettings] = useState({
    enabled: true,
    fromNumber: '+15551234567',
    serviceProvider: 'Twilio'
  });
  
  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: true,
    fromNumber: '+15551234567',
    serviceProvider: 'Twilio'
  });
  
  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    newLeadNotification: true,
    appointmentReminders: true,
    dailyDigest: true,
    weeklyReport: true
  });
  
  // Lead qualification thresholds
  const [qualificationThresholds, setQualificationThresholds] = useState({
    minimumScore: 40,
    highValueThreshold: 70
  });
  
  // Admin user
  const [adminUser, setAdminUser] = useState({
    name: 'Admin User',
    email: 'admin@kaizen-digital.com',
    phone: '+15557654321'
  });
  
  // Handle form submissions
  const handleCommunicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save the settings to the server
    alert('Communication settings saved successfully');
  };
  
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save the settings to the server
    alert('Notification settings saved successfully');
  };
  
  const handleQualificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save the settings to the server
    alert('Qualification thresholds saved successfully');
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save the settings to the server
    alert('Profile settings saved successfully');
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure your lead management and messaging system.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Communication Channels */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white flex items-center">
            <FaEnvelope className="mr-2" />
            <h2 className="text-lg font-semibold">Communication Channels</h2>
          </div>
          
          <form onSubmit={handleCommunicationSubmit} className="p-6">
            {/* Email Settings */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium flex items-center">
                  <FaEnvelope className="mr-2 text-blue-500" /> Email Settings
                </h3>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox"
                    id="toggle-email"
                    checked={emailSettings.enabled}
                    onChange={() => setEmailSettings({...emailSettings, enabled: !emailSettings.enabled})}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-email" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${emailSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                  ></label>
                </div>
              </div>
              
              <div className={emailSettings.enabled ? '' : 'opacity-50 pointer-events-none'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                    <input 
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                    <input 
                      type="text"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                  <select
                    value={emailSettings.serviceProvider}
                    onChange={(e) => setEmailSettings({...emailSettings, serviceProvider: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SendGrid">SendGrid</option>
                    <option value="Mailchimp">Mailchimp</option>
                    <option value="SMTP">Custom SMTP</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* SMS Settings */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium flex items-center">
                  <FaSms className="mr-2 text-purple-500" /> SMS Settings
                </h3>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox"
                    id="toggle-sms"
                    checked={smsSettings.enabled}
                    onChange={() => setSmsSettings({...smsSettings, enabled: !smsSettings.enabled})}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-sms" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${smsSettings.enabled ? 'bg-purple-500' : 'bg-gray-300'}`}
                  ></label>
                </div>
              </div>
              
              <div className={smsSettings.enabled ? '' : 'opacity-50 pointer-events-none'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Number</label>
                    <input 
                      type="text"
                      value={smsSettings.fromNumber}
                      onChange={(e) => setSmsSettings({...smsSettings, fromNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                    <select
                      value={smsSettings.serviceProvider}
                      onChange={(e) => setSmsSettings({...smsSettings, serviceProvider: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Twilio">Twilio</option>
                      <option value="Nexmo">Nexmo</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* WhatsApp Settings */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium flex items-center">
                  <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp Settings
                </h3>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox"
                    id="toggle-whatsapp"
                    checked={whatsappSettings.enabled}
                    onChange={() => setWhatsappSettings({...whatsappSettings, enabled: !whatsappSettings.enabled})}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-whatsapp" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${whatsappSettings.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></label>
                </div>
              </div>
              
              <div className={whatsappSettings.enabled ? '' : 'opacity-50 pointer-events-none'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Number</label>
                    <input 
                      type="text"
                      value={whatsappSettings.fromNumber}
                      onChange={(e) => setWhatsappSettings({...whatsappSettings, fromNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                    <select
                      value={whatsappSettings.serviceProvider}
                      onChange={(e) => setWhatsappSettings({...whatsappSettings, serviceProvider: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Twilio">Twilio</option>
                      <option value="WhatsApp Business API">WhatsApp Business API</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaSave className="mr-2" /> Save Channel Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-yellow-600 text-white flex items-center">
            <FaBell className="mr-2" />
            <h2 className="text-lg font-semibold">Notification Preferences</h2>
          </div>
          
          <form onSubmit={handleNotificationSubmit} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium">New Lead Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications when new leads are captured</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox"
                    id="toggle-new-lead"
                    checked={notificationSettings.newLeadNotification}
                    onChange={() => setNotificationSettings({
                      ...notificationSettings, 
                      newLeadNotification: !notificationSettings.newLeadNotification
                    })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-new-lead" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notificationSettings.newLeadNotification ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium">Appointment Reminders</h3>
                  <p className="text-sm text-gray-500">Receive reminders about upcoming appointments</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox"
                    id="toggle-appointment"
                    checked={notificationSettings.appointmentReminders}
                    onChange={() => setNotificationSettings({
                      ...notificationSettings, 
                      appointmentReminders: !notificationSettings.appointmentReminders
                    })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-appointment" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notificationSettings.appointmentReminders ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium">Daily Digest</h3>
                  <p className="text-sm text-gray-500">Receive a daily summary of lead activity</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox"
                    id="toggle-daily"
                    checked={notificationSettings.dailyDigest}
                    onChange={() => setNotificationSettings({
                      ...notificationSettings, 
                      dailyDigest: !notificationSettings.dailyDigest
                    })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-daily" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notificationSettings.dailyDigest ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium">Weekly Report</h3>
                  <p className="text-sm text-gray-500">Receive a weekly summary with statistics</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox"
                    id="toggle-weekly"
                    checked={notificationSettings.weeklyReport}
                    onChange={() => setNotificationSettings({
                      ...notificationSettings, 
                      weeklyReport: !notificationSettings.weeklyReport
                    })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="toggle-weekly" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notificationSettings.weeklyReport ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                type="submit"
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center"
              >
                <FaSave className="mr-2" /> Save Notification Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* Lead Qualification Thresholds */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-green-600 text-white flex items-center">
            <FaCalendarAlt className="mr-2" />
            <h2 className="text-lg font-semibold">Lead Qualification</h2>
          </div>
          
          <form onSubmit={handleQualificationSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Qualification Score
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={qualificationThresholds.minimumScore}
                    onChange={(e) => setQualificationThresholds({
                      ...qualificationThresholds,
                      minimumScore: parseInt(e.target.value)
                    })}
                    className="w-full mr-4"
                  />
                  <span className="text-lg font-medium w-12 text-center">{qualificationThresholds.minimumScore}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Leads with scores above this threshold are considered qualified.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  High-Value Lead Threshold
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={qualificationThresholds.highValueThreshold}
                    onChange={(e) => setQualificationThresholds({
                      ...qualificationThresholds,
                      highValueThreshold: parseInt(e.target.value)
                    })}
                    className="w-full mr-4"
                  />
                  <span className="text-lg font-medium w-12 text-center">{qualificationThresholds.highValueThreshold}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Leads with scores above this threshold are considered high-value.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <FaSave className="mr-2" /> Save Qualification Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* Admin Profile */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-purple-600 text-white flex items-center">
            <FaUser className="mr-2" />
            <h2 className="text-lg font-semibold">Admin Profile</h2>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={adminUser.name}
                  onChange={(e) => setAdminUser({...adminUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={adminUser.email}
                  onChange={(e) => setAdminUser({...adminUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={adminUser.phone}
                  onChange={(e) => setAdminUser({...adminUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Leave blank to keep current password.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
              >
                <FaSave className="mr-2" /> Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* CSS for toggle switches */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #ffffff;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: currentColor;
        }
        .toggle-checkbox {
          right: 0;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
} 