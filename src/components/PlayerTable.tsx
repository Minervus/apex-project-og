import React, { useState, useMemo } from 'react';
import PlayerTableHeader from './PlayerTableHeader';
import PlayerTableRow from './PlayerTableRow';
import PlayerProfile from './PlayerProfile';
import { usePlayers } from '../hooks/useFirestore';
import type { Player } from '../types/player';

interface PlayerTableProps {
  ageGroupFilter: string;
  statusFilter: string;
  onSelectionChange: (selectedPlayers: Player[]) => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  ageGroupFilter,
  statusFilter,
  onSelectionChange,
}) => {
  const { players, loading, error } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' as const });

  const filteredPlayers = useMemo(() => {
    return players?.filter((player) => {
      const matchesAgeGroup = ageGroupFilter === 'all' || player.ageGroup === ageGroupFilter;
      const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
      return matchesAgeGroup && matchesStatus;
    });
  }, [players, ageGroupFilter, statusFilter]);

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

  if (!players?.length) {
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
              onClick={setSelectedPlayer}
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
        />
      )}
    </>
  );
};

export default PlayerTable; 