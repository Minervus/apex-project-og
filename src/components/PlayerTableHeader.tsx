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
    { key: 'ageGroup', label: 'Age Group', width: 'w-32' },
    { key: 'name', label: 'Player', width: 'w-72' },
    { key: 'primaryPosition', label: 'Primary Position', width: 'w-40' },
    { key: 'secondaryPosition', label: 'Secondary Position', width: 'w-40' },
    { key: 'status', label: 'Status', width: 'w-32' },
    { key: 'rating', label: 'Rating', width: 'w-32' },
    { key: 'details', label: 'Details', width: 'w-20', align: 'text-right' }
  ];

  return (
    <thead className="bg-gray-50">
      <tr>
        {headers.map((header) => (
          <th
            key={header.key}
            scope="col"
            className={`${header.width} px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              header.align || ''
            }`}
          >
            {header.key === 'name' ? (
              <div className="flex items-center">
                <div className="w-10"></div>
                <div className="ml-4">{header.label}</div>
              </div>
            ) : (
              header.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default PlayerTableHeader;