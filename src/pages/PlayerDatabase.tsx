import React, { useState } from 'react';
import PlayerTable from '../components/PlayerTable';
import { Filter, Mail, CheckSquare, Square } from 'lucide-react';
import type { Player } from '../types/player';


const PlayerDatabase: React.FC = () => {
  // Filter states
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Hardcoded options (you can make these dynamic based on your data)
  const ageGroupOptions = ['all', 'BoysU18','GirlsU18'];
  const statusOptions = ['all','callback', 'declined'];

  const API_URL = import.meta.env.VITE_API_URL || 'http://54.81.134.19:3000';

  const handleSendEmail = async () => {
    if (isSending) return;
    
    try {
      setIsSending(true);
      
      const response = await fetch(`${API_URL}/api/send-bulk-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: selectedPlayers.map(player => ({
            email: player.email,
            name: player.name,
          })),
          subject: emailSubject,
          body: emailBody,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send emails');
      }

      const result = await response.json();
      console.log('Email send result:', result);

      setShowEmailModal(false);
      alert('Emails sent successfully!');
    } catch (error) {
      console.error('Error sending emails:', error);
      alert(error instanceof Error ? error.message : 'Failed to send emails. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Player Database</h1>
        
        {/* Email Button */}
        <button
          onClick={() => setShowEmailModal(true)}
          disabled={selectedPlayers.length === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Mail className="h-4 w-4" />
          <span>Email Selected ({selectedPlayers.length})</span>
        </button>

        {/* Filter Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {ageGroupOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Ages' : option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Status' : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <PlayerTable
            ageGroupFilter={ageGroupFilter}
            statusFilter={statusFilter}
            onSelectionChange={setSelectedPlayers}
          />
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">Send Email to Players</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipients ({selectedPlayers.length})
                </label>
                <div className="p-2 border rounded-md bg-gray-50 max-h-24 overflow-y-auto">
                  {selectedPlayers.map(player => (
                    <span key={player.id} className="inline-block bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-xs m-1">
                      {player.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={6}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={!emailSubject || !emailBody || isSending}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDatabase;