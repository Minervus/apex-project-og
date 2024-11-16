import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface PlayerTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

const PlayerTableHeader: React.FC<PlayerTableHeaderProps> = ({ sortConfig, onSort }) => {
  const headers = [
    { key: 'ageGroup', label: 'Age Group' },
    { key: 'name', label: 'Player' },
    { key: 'primaryPosition', label: 'Primary Position' },
    { key: 'secondaryPosition', label: 'Secondary Position' },
    { key: 'rating', label: 'Rating' }
  ];

  return (
    <thead className="bg-gray-50">
      <tr>
        {/* Age Group */}
        <th scope="col" className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Age Group
        </th>
        {/* Player Info (includes avatar and name) */}
        <th scope="col" className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="flex items-center">
            {/* Space for avatar */}
            <div className="w-10"></div>
            {/* Player name header */}
            <div className="ml-4">Player</div>
          </div>
        </th>
        {/* Primary Position */}
        <th scope="col" className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Primary Position
        </th>
        {/* Secondary Position */}
        <th scope="col" className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Secondary Position
        </th>
        {/* Status */}
        <th scope="col" className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        {/* Rating */}
        <th scope="col" className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Rating
        </th>
        {/* Actions */}
        <th scope="col" className="w-20 relative px-6 py-3">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
};

export default PlayerTableHeader;