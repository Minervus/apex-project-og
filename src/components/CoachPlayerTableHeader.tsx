import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface CoachPlayerTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

const CoachPlayerTableHeader: React.FC<CoachPlayerTableHeaderProps> = ({ sortConfig, onSort }) => {
  const headers = [
    { key: 'name', label: 'Player' },
    { key: 'primaryPosition', label: 'Primary Position' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <thead className="bg-gray-50">
      <tr>
        {headers.map(({ key, label }) => (
          <th
            key={key}
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <button
              onClick={() => onSort(key)}
              className="flex items-center space-x-1 hover:text-gray-700"
            >
              <span>{label}</span>
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default CoachPlayerTableHeader;