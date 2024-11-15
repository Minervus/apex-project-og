import React, { useState } from 'react';
import { User, ChevronRight } from 'lucide-react';
import { Player } from '../types/player';
import { usePlayers } from '../hooks/useFirestore';
import PlayerProfile from './PlayerProfile';

interface PlayerTableRowProps {
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

const PlayerTableRow: React.FC<PlayerTableRowProps> = ({ player, onClick }) => {
  return (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onClick(player)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{player.name}</div>
            <div className="text-sm text-gray-500">{player.previousTeam}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
          {player.primaryPosition}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {player.secondaryPosition && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {player.secondaryPosition}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium rounded px-2 ${getStatusColor(player.status || 'pending')}`}>
          {player.status || 'Pending'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">{player.overallRating || 'N/A'}/5.0</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </td>
    </tr>
  );
};

const PlayerTable: React.FC = () => {
  const { players, loading, error } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    // Handle closing the profile modal
  const handleClose = () => {
    setSelectedPlayer(null);
  };

  if (loading) {
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          <tr>
            <td colSpan={6} className="text-center py-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (error) {
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          <tr>
            <td colSpan={6} className="text-center py-4 text-red-600">
              {error}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (!players.length) {
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          <tr>
            <td colSpan={6} className="text-center py-4 text-gray-500">
              No players found
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {/* ... existing thead content ... */}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {players.map((player) => (
            <PlayerTableRow 
              key={player.id} 
              player={player} 
              onClick={setSelectedPlayer}
            />
          ))}
        </tbody>
      </table>

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 w-full max-w-4xl">
            <div className="relative bg-white rounded-lg shadow-xl">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <PlayerProfile player={selectedPlayer} onClose={handleClose} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerTable;