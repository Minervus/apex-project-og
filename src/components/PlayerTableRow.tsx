import React from 'react';
import { User, ChevronRight, CheckSquare, Square } from 'lucide-react';
import type { Player } from '../types/player';

interface PlayerTableRowProps {
  player: Player;
  onClick: (player: Player) => void;
  isSelected: boolean;
  onToggleSelect: (playerId: string) => void;
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

const PlayerTableRow: React.FC<PlayerTableRowProps> = ({
  player,
  onClick,
  isSelected,
  onToggleSelect,
}) => {
  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent row click when clicking the checkbox
    if ((e.target as HTMLElement).closest('button')) return;
    onClick(player);
  };

  return (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleRowClick}
    >
      {/* Select */}
      <td className="px-6 py-4 whitespace-nowrap">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(player.id);
          }}
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5 text-indigo-600" />
          ) : (
            <Square className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </td>
        {/* Age Group */}
      <td className="w-32 px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          {player.ageGroup}
        </span>
      </td>
      
      {/* Player Info */}
      <td className="w-72 px-6 py-4 whitespace-nowrap">
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
            <div className="text-sm text-gray-500">{player.previousTeam}</div>
          </div>
        </div>
      </td>

      {/* Primary Position */}
      <td className="w-40 px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
          {player.primaryPosition}
        </span>
      </td>

      {/* Secondary Position */}
      <td className="w-40 px-6 py-4 whitespace-nowrap">
        {player.secondaryPosition && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {player.secondaryPosition}
          </span>
        )}
      </td>

      {/* Status */}
      <td className="w-32 px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium rounded px-2 ${getStatusColor(player.status || 'pending')}`}>
          {player.status || 'Pending'}
        </div>
      </td>

      {/* Rating */}
      <td className="w-32 px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">{player.overallRating || 'N/A'}/5.0</div>
      </td>

      {/* Details */}
      <td className="w-20 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </td>

      
    </tr>
  );
};

export default PlayerTableRow;