import React from 'react';

const PlayerTableHeader: React.FC = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {/* Age Group */}
        <th scope="col" className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Age Group
        </th>
        {/* Player Info */}
        <th scope="col" className="w-72 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="flex items-center">
            <div className="w-10"></div>
            <div className="ml-4">Player</div>
          </div>
        </th>
        {/* Primary Position */}
        <th scope="col" className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
          Primary Position
        </th>
        {/* Secondary Position */}
        <th scope="col" className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
        <th scope="col" className="w-20 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          Details
        </th>
      </tr>
    </thead>
  );
};

export default PlayerTableHeader;