export interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  ageGroup: string;
  height: number;
  rating: number;
  previousTeam: string;
  assessments?: {
    ballControl?: string;
    attacking?: string;
    serving?: string;
    setting?: string;
    digging?: string;
  };
}

export const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Outside Hitter",
    age: 16,
    ageGroup: "Boys U17",
    height: 185,
    rating: 4.5,
    previousTeam: "Eagles VC"
  },
  {
    id: 2,
    name: "Sarah Williams",
    position: "Setter",
    age: 15,
    ageGroup: "Girls U16",
    height: 170,
    rating: 4.2,
    previousTeam: "Phoenix VBC"
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Middle Blocker",
    age: 17,
    ageGroup: "Boys U18",
    height: 192,
    rating: 4.8,
    previousTeam: "Hawks VC"
  },
  {
    id: 4,
    name: "Emma Davis",
    position: "Libero",
    age: 14,
    ageGroup: "Girls U15",
    height: 165,
    rating: 4.0,
    previousTeam: "Spartans VBC"
  },
  {
    id: 5,
    name: "James Wilson",
    position: "Opposite Hitter",
    age: 16,
    ageGroup: "Boys U17",
    height: 188,
    rating: 4.3,
    previousTeam: "Tigers VC"
  }
];