import React, { useState, useMemo, useEffect } from 'react';
import PlayerTableHeader from './PlayerTableHeader';
import PlayerTableRow from './PlayerTableRow';
import PlayerProfile from './PlayerProfile';
import { usePlayers } from '../hooks/useFirestore';
import type { Player } from '../types/player';

interface PlayerTableProps {
  ageGroupFilter: string;
  statusFilter: string;
  onSelectionChange: (players: Player[]) => void;
  players: Player[];
  onPlayerUpdate: (player: Player) => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  ageGroupFilter,
  statusFilter,
  onSelectionChange,
  players,
  onPlayerUpdate,
  selectedPlayer,
  setSelectedPlayer
}) => {
  const { players: firestorePlayers, loading, error } = usePlayers();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' as const });

  useEffect(() => {
    console.log('PlayerTable received updated players:', players);
  }, [players]);

  const filteredPlayers = useMemo(() => {
    let sorted = [...(firestorePlayers || [])].filter((player) => {
      const matchesAgeGroup = ageGroupFilter === 'all' || player.ageGroup === ageGroupFilter;
      const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
      return matchesAgeGroup && matchesStatus;
    });

    // Add sorting logic
    sorted.sort((a, b) => {
      if (sortConfig.key === 'number') {
        // Convert to numbers for comparison, treating empty/null values as -1
        const aNum = a.number ? parseInt(a.number) : -1;
        const bNum = b.number ? parseInt(b.number) : -1;
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle other fields
      const aValue = a[sortConfig.key as keyof Player] || '';
      const bValue = b[sortConfig.key as keyof Player] || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [firestorePlayers, ageGroupFilter, statusFilter, sortConfig]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredPlayers?.length) {
      setSelectedIds(new Set());
      onSelectionChange([]);
    } else {
      const newSelected = new Set(filteredPlayers?.map(p => p.id));
      setSelectedIds(newSelected);
      onSelectionChange(filteredPlayers || []);
    }
  };

  const handleToggleSelect = (playerId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedIds(newSelected);
    onSelectionChange(filteredPlayers?.filter(p => newSelected.has(p.id)) || []);
  };

  const handlePlayerUpdate = (updatedPlayer: Player) => {
    onPlayerUpdate(updatedPlayer);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (!firestorePlayers?.length) {
    return <div className="text-center py-4 text-gray-500">No players found</div>;
  }

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <PlayerTableHeader
          sortConfig={sortConfig}
          onSort={(key) => setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
          })}
          onSelectAll={handleSelectAll}
          isAllSelected={selectedIds.size === filteredPlayers?.length && filteredPlayers?.length > 0}
          hasFilteredPlayers={!!filteredPlayers?.length}
        />
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPlayers?.map((player) => (
            <PlayerTableRow
              key={player.id}
              player={player}
              onClick={(player) => setSelectedPlayer(player)}
              isSelected={selectedIds.has(player.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </tbody>
      </table>

      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onUpdate={(updatedPlayer) => {
            console.log('PlayerProfile update:', updatedPlayer);
            onPlayerUpdate(updatedPlayer);
          }}
        />
      )}
    </>
  );
};

export default PlayerTable; 