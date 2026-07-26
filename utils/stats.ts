import { MapStats, PeriodStats, Session } from '../types';

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

export function computeStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const days = new Set(sessions.map((s) => dateKey(s.playedAt)));
  const cursor = new Date();

  if (!days.has(dateKey(cursor.toISOString()))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dateKey(cursor.toISOString()))) return 0;
  }

  let streak = 0;
  while (days.has(dateKey(cursor.toISOString()))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computePeriodStats(sessions: Session[]): PeriodStats {
  if (sessions.length === 0) {
    return {
      sessionCount: 0,
      winRate: 0,
      kd: 0,
      avgAdr: 0,
      avgHsPercent: 0,
      avgKills: 0,
      avgDeaths: 0,
      avgAssists: 0,
    };
  }

  const wins = sessions.filter((s) => s.result === 'win').length;
  const totalKills = sessions.reduce((sum, s) => sum + s.kills, 0);
  const totalDeaths = sessions.reduce((sum, s) => sum + s.deaths, 0);
  const totalAssists = sessions.reduce((sum, s) => sum + s.assists, 0);
  const totalAdr = sessions.reduce((sum, s) => sum + s.adr, 0);
  const totalHs = sessions.reduce((sum, s) => sum + s.hsPercent, 0);

  return {
    sessionCount: sessions.length,
    winRate: (wins / sessions.length) * 100,
    kd: totalDeaths > 0 ? totalKills / totalDeaths : totalKills,
    avgAdr: totalAdr / sessions.length,
    avgHsPercent: totalHs / sessions.length,
    avgKills: totalKills / sessions.length,
    avgDeaths: totalDeaths / sessions.length,
    avgAssists: totalAssists / sessions.length,
  };
}

export function sessionsInLastDays(sessions: Session[], days: number, offsetDays = 0): Session[] {
  const now = Date.now();
  const end = now - offsetDays * 86400000;
  const start = end - days * 86400000;
  return sessions.filter((s) => {
    const t = new Date(s.playedAt).getTime();
    return t > start && t <= end;
  });
}

export function computeMapStats(sessions: Session[]): MapStats[] {
  const byMap = new Map<string, Session[]>();
  for (const s of sessions) {
    const list = byMap.get(s.map) ?? [];
    list.push(s);
    byMap.set(s.map, list);
  }

  return Array.from(byMap.entries())
    .map(([map, mapSessions]) => {
      const stats = computePeriodStats(mapSessions);
      return {
        map,
        sessionCount: stats.sessionCount,
        winRate: stats.winRate,
        kd: stats.kd,
        avgAdr: stats.avgAdr,
      };
    })
    .sort((a, b) => b.winRate - a.winRate);
}

export interface WeeklyBucket {
  label: string;
  stats: PeriodStats;
}

export function computeWeeklySeries(
  sessions: Session[],
  weeks = 8
): WeeklyBucket[] {
  const now = Date.now();
  const buckets: WeeklyBucket[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const end = now - i * 7 * 86400000;
    const start = end - 7 * 86400000;
    const bucketSessions = sessions.filter((s) => {
      const t = new Date(s.playedAt).getTime();
      return t > start && t <= end;
    });
    const label = new Date(end).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    });
    buckets.push({ label, stats: computePeriodStats(bucketSessions) });
  }

  return buckets.filter((b) => b.stats.sessionCount > 0);
}

export function chronological(sessions: Session[]): Session[] {
  return [...sessions].sort(
    (a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()
  );
}
