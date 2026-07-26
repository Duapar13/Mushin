import { Goal, PeriodStats } from '../types';

export interface GoalProgress {
  goal: Goal;
  currentValue: number;
  currentLabel: string;
  progress: number; // 0-1
}

export function computeGoalProgress(
  goal: Goal,
  stats: PeriodStats,
  latestRank?: string
): GoalProgress {
  switch (goal.metric) {
    case 'winRate':
      return {
        goal,
        currentValue: stats.winRate,
        currentLabel: `${stats.winRate.toFixed(0)}%`,
        progress: clamp(stats.winRate / goal.targetValue),
      };
    case 'kd':
      return {
        goal,
        currentValue: stats.kd,
        currentLabel: stats.kd.toFixed(2),
        progress: clamp(stats.kd / goal.targetValue),
      };
    case 'adr':
      return {
        goal,
        currentValue: stats.avgAdr,
        currentLabel: stats.avgAdr.toFixed(0),
        progress: clamp(stats.avgAdr / goal.targetValue),
      };
    case 'hsPercent':
      return {
        goal,
        currentValue: stats.avgHsPercent,
        currentLabel: `${stats.avgHsPercent.toFixed(0)}%`,
        progress: clamp(stats.avgHsPercent / goal.targetValue),
      };
    case 'rank':
      return {
        goal,
        currentValue: 0,
        currentLabel: latestRank && latestRank.length > 0 ? latestRank : '—',
        progress: 0,
      };
  }
}

function clamp(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export const GOAL_METRIC_LABELS: Record<Goal['metric'], string> = {
  winRate: 'Win rate',
  kd: 'K/D',
  adr: 'ADR',
  hsPercent: 'HS%',
  rank: 'Rang',
};
