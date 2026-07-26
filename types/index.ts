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
  'Cache',
  'Autre',
] as const;

export type Cs2Map = (typeof CS2_MAPS)[number];

export type RankSystem = 'faceit' | 'premier';

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
  rankSystem: RankSystem;
  rankValue: number; // Faceit: level 1-10 · Premier: ELO
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
