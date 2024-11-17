export interface Player {
  id: string;
  name: string;
  previousTeam?: string;
  primaryPosition: string;
  secondaryPosition?: string;
  status?: 'callback' | 'declined' | 'pending';
  overallRating?: number;
  imageUrl?: string;
  assessments?: {
    [key: string]: any;
  };
  ballControlAverage?: string | null;
  attackingAverage?: string | null;
  servingAverage?: string | null;
  defenseAverage?: string | null;
}

export interface Assessment {
  scores: Record<ScoreCategory, number>;
  notes: string;
  status: 'callback' | 'decline';
  assessedAt: string;
  assessedBy: string;
}

export type ScoreCategory = 
  | 'serving'
  | 'passing'
  | 'setting'
  | 'hitting'
  | 'blocking'
  | 'communication';

  export function isPlayer(obj: any): obj is Player {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.id === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.email === 'string' &&
      typeof obj.phone === 'string' &&
      typeof obj.birthDate === 'string' &&
      typeof obj.primaryPosition === 'string' &&
      Array.isArray(obj.tryingOutFor)
    );
  }
  
  // Update the usePlayers hook to use the type guard
  export const usePlayers = () => {
    // ... existing code ...
  
    const fetchedPlayers = querySnapshot.docs.map(doc => {
      const data = {
        id: doc.id,
        ...doc.data()
      };
      if (!isPlayer(data)) {
        console.error('Invalid player data:', data);
        return null;
      }
      return data;
    }).filter((player): player is Player => player !== null);
    // ... rest of the code ...
  };