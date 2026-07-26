export type MatchResult = 'win' | 'loss' | 'draw';

export const CS2_MAPS = [
  'Mirage',
  'Inferno',
  'Nuke',
  'Ancient',
  'Anubis',
  'Dust2',
  'Train',
  'Overpass',
  'Vertigo',
  'Autre',
] as const;

export type Cs2Map = (typeof CS2_MAPS)[number];

export interface Session {
  id: number;
  playedAt: string; // ISO datetime
  map: string;
  result: MatchResult;
  kills: number;
  deaths: number;
  assists: number;
  adr: number;
  hsPercent: number;
  rank: string;
  durationMinutes: number;
  focusBefore: number; // 1-5
  focusAfter: number; // 1-5
  tiltBefore: number; // 1-5
  tiltAfter: number; // 1-5
  sleepHours: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionInput = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;

export type GoalMetric = 'winRate' | 'kd' | 'adr' | 'hsPercent' | 'rank';

export interface Goal {
  id: number;
  metric: GoalMetric;
  label: string;
  targetValue: number;
  targetLabel: string; // free-text target for rank goals (e.g. "Elite Gold Master")
  createdAt: string;
}

export type GoalInput = Omit<Goal, 'id' | 'createdAt'>;

export interface PeriodStats {
  sessionCount: number;
  winRate: number;
  kd: number;
  avgAdr: number;
  avgHsPercent: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
}

export interface MapStats {
  map: string;
  sessionCount: number;
  winRate: number;
  kd: number;
  avgAdr: number;
}
