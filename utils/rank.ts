import { RankSystem, Session } from '../types';

export const RANK_SYSTEM_LABELS: Record<RankSystem, string> = {
  faceit: 'Faceit',
  premier: 'Premier',
};

export function formatRank(session: Pick<Session, 'rankSystem' | 'rankValue'>): string {
  if (session.rankSystem === 'faceit') {
    return `Faceit · Level ${session.rankValue}`;
  }
  return `Premier · ${session.rankValue.toLocaleString('fr-FR')} ELO`;
}
