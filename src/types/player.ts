export interface Player {
  id: string;
  name: string;
  previousTeam?: string;
  primaryPosition: string;
  secondaryPosition?: string;
  status?: 'callback' | 'declined' | 'pending';
  overallRating?: number;
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