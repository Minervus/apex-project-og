import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import CoachPlayerTableHeader from './CoachPlayerTableHeader';
import CoachPlayerTableRow from './CoachPlayerTableRow';
import type { Player } from '../types/player';

interface CoachPlayerTableProps {
  players: Player[];
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onSort: (key: string) => void;
  onPlayerClick: (player: Player) => void;
}

interface GroupedPlayers {
  [key: string]: Player[];
}

const CoachPlayerTable: React.FC<CoachPlayerTableProps> = ({
  players,
  sortConfig,
  onSort,
  onPlayerClick
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group players by age group
  const groupedPlayers = players.reduce((groups: GroupedPlayers, player) => {
    const ageGroups = player.tryingOutFor || ['Unassigned'];
    ageGroups.forEach(group => {
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(player);
    });
    return groups;
  }, {});

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <CoachPlayerTableHeader sortConfig={sortConfig} onSort={onSort} />
      <tbody className="bg-white divide-y divide-gray-200">
        {Object.entries(groupedPlayers).map(([group, groupPlayers]) => (
          <React.Fragment key={group}>
            {/* Group Header Row */}
            <tr 
              className="bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleGroup(group)}
            >
              <td colSpan={3} className="px-6 py-3">
                <div className="flex items-center">
                  {expandedGroups.has(group) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                  )}
                  <span className="font-medium text-gray-900">
                    {group} ({groupPlayers.length} players)
                  </span>
                </div>
              </td>
            </tr>
            {/* Player Rows */}
            {expandedGroups.has(group) && groupPlayers.map((player) => (
              <CoachPlayerTableRow 
                key={player.id} 
                player={player} 
                onClick={onPlayerClick}
              />
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default CoachPlayerTable; 