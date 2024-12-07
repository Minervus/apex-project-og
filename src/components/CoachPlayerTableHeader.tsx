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
  return (
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => onSort('number')}>
          <div className="flex items-center">
            #
            <ArrowUpDown className="h-4 w-4 ml-1" />
          </div>
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => onSort('name')}>
          <div className="flex items-center">
            Player
            <ArrowUpDown className="h-4 w-4 ml-1" />
          </div>
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => onSort('primaryPosition')}>
          <div className="flex items-center">
            Position
            <ArrowUpDown className="h-4 w-4 ml-1" />
          </div>
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => onSort('status')}>
          <div className="flex items-center">
            Status
            <ArrowUpDown className="h-4 w-4 ml-1" />
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default CoachPlayerTableHeader;