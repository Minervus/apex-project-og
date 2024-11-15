import { useState, useEffect } from 'react';
import { getPlayers, getTeams } from '../lib/firestore';
import type { Player } from '../types/player';
import type { Team } from '../types/team';

export const usePlayers = (pageSize = 15) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const result = await getPlayers(pageSize);
        setPlayers(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [pageSize]);

  return { players, loading, error };
};

export const useTeams = (pageSize = 15) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const result = await getTeams(pageSize);
        setTeams(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    fetchTeams();
  }, [pageSize]);

  return { teams, loading, error };
};