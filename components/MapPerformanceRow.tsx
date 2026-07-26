import { View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ProgressBar } from './ProgressBar';
import { MapStats } from '../types';
import { Spacing } from '../constants/theme';

export function MapPerformanceRow({ stats }: { stats: MapStats }) {
  return (
    <View style={{ gap: 4, paddingVertical: Spacing.xs }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ThemedText variant="subhead" weight="600">
          {stats.map}
        </ThemedText>
        <ThemedText variant="footnote" color="secondary">
          {stats.winRate.toFixed(0)}% WR · {stats.kd.toFixed(2)} K/D · {stats.sessionCount} sess.
        </ThemedText>
      </View>
      <ProgressBar progress={stats.winRate / 100} />
    </View>
  );
}
