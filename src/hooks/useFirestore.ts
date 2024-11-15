import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Player } from '../types/player';
import type { Team } from '../types/team';

export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        console.log('🚀 Starting to fetch players...');
        const playersRef = collection(db, 'players');
        
        // Remove the orderBy if it's causing issues
        const querySnapshot = await getDocs(playersRef);
        
        console.log('📦 Query snapshot received:', {
          empty: querySnapshot.empty,
          size: querySnapshot.size,
          totalDocs: querySnapshot.docs.length,
          docs: querySnapshot.docs.map(doc => ({ id: doc.id }))
        });

        const fetchedPlayers = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('📄 Processing document:', { id: doc.id, ...data });
          return {
            id: doc.id,
            ...data
          };
        }) as Player[];

        console.log('✅ Total players fetched:', fetchedPlayers.length);
        setPlayers(fetchedPlayers);
      } catch (err) {
        console.error('❌ Error fetching players:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return { players, loading, error };
};

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log('Fetching teams from Firestore...');
        const teamsRef = collection(db, 'teams');
        const q = query(teamsRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedTeams = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Team[];

        console.log('Fetched teams:', fetchedTeams);
        setTeams(fetchedTeams);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return { teams, loading, error };
};

// Utility function to get a single player by ID
export const getPlayerById = async (playerId: string): Promise<Player | null> => {
  try {
    const playerRef = doc(db, 'players', playerId);
    const playerSnap = await getDoc(playerRef);
    
    if (playerSnap.exists()) {
      return {
        id: playerSnap.id,
        ...playerSnap.data()
      } as Player;
    }
    return null;
  } catch (err) {
    console.error('Error fetching player:', err);
    throw err;
  }
};

// Utility function to get a single team by ID
export const getTeamById = async (teamId: string): Promise<Team | null> => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamSnap = await getDoc(teamRef);
    
    if (teamSnap.exists()) {
      return {
        id: teamSnap.id,
        ...teamSnap.data()
      } as Team;
    }
    return null;
  } catch (err) {
    console.error('Error fetching team:', err);
    throw err;
  }
};