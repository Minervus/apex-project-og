interface Assessment {
  rating: number;
  notes?: string;
}

interface Assessments {
  [key: string]: Assessment;
}

export interface TodaysPlayer {
  id: number;
  name: string;
  position: string;
  team: string;
  ageGroup: string;
  wave: number;
  tryoutTime: string;
  assessments?: Assessments;
}

export interface WaveGroup {
  wave: number;
  players: TodaysPlayer[];
}

export interface AgeGroup {
  ageGroup: string;
  waves: WaveGroup[];
}

export const todaysPlayers: AgeGroup[] = [
  {
    ageGroup: "Boys U17",
    waves: [
      {
        wave: 1,
        players: [
          {
            id: 1,
            name: "Alex Johnson",
            position: "Outside Hitter",
            team: "Eagles VC",
            ageGroup: "Boys U17",
            wave: 1,
            tryoutTime: "09:00 AM"
          },
          {
            id: 2,
            name: "Marcus Lee",
            position: "Middle Blocker",
            team: "Eagles VC",
            ageGroup: "Boys U17",
            wave: 1,
            tryoutTime: "09:30 AM"
          }
        ]
      },
      {
        wave: 2,
        players: [
          {
            id: 7,
            name: "James Wilson",
            position: "Setter",
            team: "Eagles VC",
            ageGroup: "Boys U17",
            wave: 2,
            tryoutTime: "02:00 PM"
          }
        ]
      }
    ]
  },
  {
    ageGroup: "Girls U16",
    waves: [
      {
        wave: 1,
        players: [
          {
            id: 3,
            name: "Sarah Williams",
            position: "Setter",
            team: "Phoenix VBC",
            ageGroup: "Girls U16",
            wave: 1,
            tryoutTime: "10:00 AM"
          },
          {
            id: 4,
            name: "Emily Chen",
            position: "Libero",
            team: "Phoenix VBC",
            ageGroup: "Girls U16",
            wave: 1,
            tryoutTime: "10:30 AM"
          }
        ]
      }
    ]
  },
  {
    ageGroup: "Boys U18",
    waves: [
      {
        wave: 2,
        players: [
          {
            id: 5,
            name: "David Thompson",
            position: "Opposite Hitter",
            team: "Hawks VC",
            ageGroup: "Boys U18",
            wave: 2,
            tryoutTime: "11:00 AM"
          }
        ]
      },
      {
        wave: 3,
        players: [
          {
            id: 6,
            name: "Michael Brown",
            position: "Middle Blocker",
            team: "Hawks VC",
            ageGroup: "Boys U18",
            wave: 3,
            tryoutTime: "03:30 PM"
          }
        ]
      }
    ]
  }
];