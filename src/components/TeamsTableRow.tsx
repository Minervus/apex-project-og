import React from 'react';
import { Users } from 'lucide-react';
import { Team } from '../data/mockTeams';
import { useNavigate } from 'react-router-dom';

interface TeamsTableRowProps {
  team: Team;
}

const TeamsTableRow: React.FC<TeamsTableRowProps> = ({ team }) => {
  const navigate = useNavigate();

  return (
    <tr 
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/teams/${team.id}`)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{team.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {team.owner}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {team.headCoach}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {team.ageGroup}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {team.players} players
      </td>
    </tr>
  );
};

export default TeamsTableRow;