export interface Team {
  id: number;
  name: string;
  owner: string;
  headCoach: string;
  ageGroup: string;
  players?: number;
}

export const mockTeams: Team[] = [
  {
    id: 1,
    name: "Eagles VC",
    owner: "Robert Thompson",
    headCoach: "Mike Anderson",
    ageGroup: "Boys U17",
    players: 12
  },
  {
    id: 2,
    name: "Phoenix VBC",
    owner: "Sarah Martinez",
    headCoach: "David Wilson",
    ageGroup: "Girls U16",
    players: 14
  },
  {
    id: 3,
    name: "Hawks VC",
    owner: "James Chen",
    headCoach: "Lisa Wong",
    ageGroup: "Boys U18",
    players: 15
  },
  {
    id: 4,
    name: "Spartans VBC",
    owner: "Emily Davis",
    headCoach: "John Smith",
    ageGroup: "Girls U15",
    players: 13
  },
  {
    id: 5,
    name: "Tigers VC",
    owner: "Michael Brown",
    headCoach: "Karen Johnson",
    ageGroup: "Boys U16",
    players: 12
  }
];