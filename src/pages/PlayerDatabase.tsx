import React from 'react';
import PlayerTable from '../components/PlayerTableRow';


const PlayerDatabase: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Player Database</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        
        <PlayerTable />
      </div>
    </div>
  );
};

export default PlayerDatabase;