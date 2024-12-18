import React from 'react';
import { User } from 'lucide-react';
import type { Player } from '../types/player';

interface CoachPlayerTableRowProps {
  player: Player;
  onClick: (player: Player) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'callback':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'declined':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CoachPlayerTableRow: React.FC<CoachPlayerTableRowProps> = ({ player, onClick }) => {
  return (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onClick(player)}
    >
      <td className="w-24 px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          #{player.number || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {player.imageUrl ? (
              <img
                src={player.imageUrl}
                alt={`${player.name}'s profile`}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to User icon if image fails to load
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-indigo-100', 'flex', 'items-center', 'justify-center');
                  const icon = document.createElement('div');
                  icon.innerHTML = '<div class="h-5 w-5 text-indigo-600"><svg>...</svg></div>';
                  e.currentTarget.parentElement?.appendChild(icon);
                }}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{player.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
          {player.primaryPosition}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(player.status || 'pending')}`}>
          {player.status || 'Pending'}
        </span>
      </td>
    </tr>
  );
};

export default CoachPlayerTableRow;