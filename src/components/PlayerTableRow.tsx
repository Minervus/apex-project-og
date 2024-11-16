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
      <td className="w-32 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {player.ageGroup}
      </td>
      <td className="w-72 px-6 py-4 whitespace-nowrap">
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
      <td className="w-40 px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
          {player.primaryPosition}
        </span>
      </td>
      <td className="w-40 px-6 py-4 whitespace-nowrap">
        {player.secondaryPosition && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {player.secondaryPosition}
          </span>
        )}
      </td>
      <td className="w-32 px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium rounded px-2 ${getStatusColor(player.status || 'pending')}`}>
          {player.status || 'Pending'}
        </div>
      </td>
      <td className="w-32 px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">{player.overallRating || 'N/A'}/5.0</div>
      </td>
      <td className="w-20 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </td>
    </tr>
  );
};

// ... keep all the imports and PlayerTableRow component the same ...

const PlayerTable: React.FC = () => {
  const { players, loading, error } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} className="text-center py-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (error) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} className="text-center py-4 text-red-600">
            {error}
          </td>
        </tr>
      </tbody>
    );
  }

  if (!players.length) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} className="text-center py-4 text-gray-500">
            No players found
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <>
      <tbody className="bg-white divide-y divide-gray-200">
        {players.map((player) => (
          <PlayerTableRow 
            key={player.id} 
            player={player} 
            onClick={setSelectedPlayer}
          />
        ))}
      </tbody>

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          {/* ... modal content ... */}
        </div>
      )}
    </>
  );
};

export default PlayerTable;