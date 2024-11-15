import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, UserCog, Shield } from 'lucide-react';
import { mockTeams } from '../data/mockTeams';
import { mockPlayers } from '../data/mockPlayers';
import PlayerTableHeader from '../components/PlayerTableHeader';
import PlayerTableRow from '../components/PlayerTableRow';
import PlayerProfile from '../components/PlayerProfile';

const TeamDetails = () => {
  const { id } = useParams();
  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  
  const team = mockTeams.find(t => t.id === Number(id));
  const teamPlayers = mockPlayers.filter(player => player.previousTeam === team?.name);

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Team not found</p>
        <Link to="/teams" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Return to Teams
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/teams"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Teams
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-500">{team.ageGroup}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <UserCog className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Head Coach</p>
                <p className="font-medium">{team.headCoach}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Team Owner</p>
                <p className="font-medium">{team.owner}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Players</p>
                <p className="font-medium">{team.players} members</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Team Players</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <PlayerTableHeader
              sortConfig={{ key: 'name', direction: 'asc' }}
              onSort={() => {}}
            />
            <tbody className="bg-white divide-y divide-gray-200">
              {teamPlayers.map((player) => (
                <PlayerTableRow
                  key={player.id}
                  player={player}
                  onClick={setSelectedPlayer}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default TeamDetails;