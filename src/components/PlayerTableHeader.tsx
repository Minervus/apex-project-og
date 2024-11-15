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
        {headers.map(({ key, label }) => (
          <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <button
              onClick={() => onSort(key)}
              className="flex items-center space-x-1 hover:text-gray-700"
            >
              <span>{label}</span>
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </th>
        ))}
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
};

export default PlayerTableHeader;