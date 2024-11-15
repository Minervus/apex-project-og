import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import TeamsTableHeader from '../components/TeamsTableHeader';
import TeamsTableRow from '../components/TeamsTableRow';
import Pagination from '../components/Pagination';
import { useTeams } from '../hooks/useFirestore';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' as const });
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 15;

  const { teams, loading, error } = useTeams(teamsPerPage, currentPage);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.headCoach.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeGroup = ageGroupFilter === 'all' || team.ageGroup === ageGroupFilter;
    return matchesSearch && matchesAgeGroup;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <select
            value={ageGroupFilter}
            onChange={(e) => setAgeGroupFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Age Groups</option>
            <option value="Boys U15">Boys U15</option>
            <option value="Girls U15">Girls U15</option>
            <option value="Boys U16">Boys U16</option>
            <option value="Girls U16">Girls U16</option>
            <option value="Boys U17">Boys U17</option>
            <option value="Girls U17">Girls U17</option>
            <option value="Boys U18">Boys U18</option>
            <option value="Girls U18">Girls U18</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TeamsTableHeader sortConfig={sortConfig} onSort={handleSort} />
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeams.map((team) => (
                <TeamsTableRow key={team.id} team={team} />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(teams.length / teamsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Teams;