import React, { useState } from 'react';
import PlayerTable from '../components/PlayerTableRow';
import { Filter } from 'lucide-react';

const PlayerDatabase: React.FC = () => {
  // Filter states
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Hardcoded options (you can make these dynamic based on your data)
  const ageGroupOptions = ['all', 'BoysU18','GirlsU18'];
  const statusOptions = ['all','callback', 'declined'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Player Database</h1>
        
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
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerDatabase;