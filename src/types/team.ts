export interface Team {
  id: string;
  name: string;
  ageGroup: string;
  division?: string;
  coach?: string;
  players?: string[];
}