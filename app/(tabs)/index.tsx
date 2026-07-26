import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { MushinWordmark } from '../../components/MushinWordmark';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Card } from '../../components/Card';
import { StatTile } from '../../components/StatTile';
import { ProgressBar } from '../../components/ProgressBar';
import { MapPerformanceRow } from '../../components/MapPerformanceRow';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from '../../constants/theme';
import {
  computeMapStats,
  computePeriodStats,
  computeStreak,
  computeWeeklySeries,
  sessionsInLastDays,
} from '../../utils/stats';
import { computeGoalProgress } from '../../utils/goalProgress';
import { formatRank } from '../../utils/rank';

function delta(current: number, previous: number): { text: string; positive: boolean } {
  if (previous === 0 && current === 0) return { text: '—', positive: false };
  if (previous === 0) return { text: 'nouveau', positive: true };
  const diff = current - previous;
  const pct = (diff / previous) * 100;
  const sign = diff >= 0 ? '+' : '';
  return { text: `${sign}${pct.toFixed(0)}%`, positive: diff >= 0 };
}

export default function DashboardScreen() {
  const { sessions, goals } = useData();
  const { colors } = useTheme();

  const last7 = computePeriodStats(sessionsInLastDays(sessions, 7));
  const prev7 = computePeriodStats(sessionsInLastDays(sessions, 7, 7));
  const streak = computeStreak(sessions);
  const weekly = computeWeeklySeries(sessions, 8);
  const mapStats = computeMapStats(sessions).slice(0, 5);
  const recentStats30 = computePeriodStats(sessionsInLastDays(sessions, 30));

  const lineData = (values: number[]) =>
    values.map((v) => ({ value: Number.isFinite(v) ? v : 0 }));

  return (
    <ThemedView variant="grouped" style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl }}>
          <MushinWordmark size={36} />

          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <Ionicons name="flame" size={32} color={colors.accent} />
            <View>
              <ThemedText variant="title1" weight="700">
                {streak} {streak > 1 ? 'jours' : 'jour'}
              </ThemedText>
              <ThemedText variant="footnote" color="secondary">
                Streak actuel
              </ThemedText>
            </View>
          </Card>

          <View>
            <ThemedText variant="headline" style={{ marginBottom: Spacing.sm }}>
              7 derniers jours
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm }}>
              <StatTile
                label="Win rate"
                value={`${last7.winRate.toFixed(0)}%`}
                delta={delta(last7.winRate, prev7.winRate).text}
                deltaPositive={delta(last7.winRate, prev7.winRate).positive}
              />
              <StatTile
                label="K/D"
                value={last7.kd.toFixed(2)}
                delta={delta(last7.kd, prev7.kd).text}
                deltaPositive={delta(last7.kd, prev7.kd).positive}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <StatTile
                label="ADR"
                value={last7.avgAdr.toFixed(0)}
                delta={delta(last7.avgAdr, prev7.avgAdr).text}
                deltaPositive={delta(last7.avgAdr, prev7.avgAdr).positive}
              />
              <StatTile
                label="HS%"
                value={`${last7.avgHsPercent.toFixed(0)}%`}
                delta={delta(last7.avgHsPercent, prev7.avgHsPercent).text}
                deltaPositive={delta(last7.avgHsPercent, prev7.avgHsPercent).positive}
              />
            </View>
          </View>

          {goals.length > 0 && (
            <View>
              <ThemedText variant="headline" style={{ marginBottom: Spacing.sm }}>
                Objectifs
              </ThemedText>
              <Card style={{ gap: Spacing.md }}>
                {goals.slice(0, 3).map((goal) => {
                  const progress = computeGoalProgress(
                    goal,
                    recentStats30,
                    sessions[0] ? formatRank(sessions[0]) : undefined
                  );
                  return (
                    <View key={goal.id} style={{ gap: 4 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <ThemedText variant="subhead" weight="600">
                          {goal.label}
                        </ThemedText>
                        <ThemedText variant="footnote" color="secondary">
                          {goal.metric === 'rank'
                            ? goal.targetLabel
                            : `${progress.currentLabel} / ${goal.targetValue}`}
                        </ThemedText>
                      </View>
                      {goal.metric !== 'rank' && (
                        <ProgressBar progress={progress.progress} />
                      )}
                    </View>
                  );
                })}
              </Card>
            </View>
          )}

          {weekly.length >= 2 && (
            <View>
              <ThemedText variant="headline" style={{ marginBottom: Spacing.sm }}>
                Évolution (par semaine)
              </ThemedText>
              <Card style={{ gap: Spacing.lg }}>
                <View>
                  <ThemedText variant="footnote" color="secondary" style={{ marginBottom: 4 }}>
                    Win rate (%)
                  </ThemedText>
                  <LineChart
                    data={lineData(weekly.map((w) => w.stats.winRate))}
                    height={100}
                    thickness={2}
                    color={colors.accent}
                    hideRules
                    hideYAxisText
                    hideAxesAndRules
                    hideDataPoints={false}
                    dataPointsColor={colors.accent}
                    dataPointsRadius={3}
                    startFillColor={colors.accent}
                    startOpacity={0.08}
                    endOpacity={0}
                    areaChart
                    xAxisColor="transparent"
                    yAxisColor="transparent"
                    initialSpacing={8}
                    spacing={(320 - 16) / Math.max(weekly.length - 1, 1)}
                    disableScroll
                  />
                </View>
                <View>
                  <ThemedText variant="footnote" color="secondary" style={{ marginBottom: 4 }}>
                    K/D
                  </ThemedText>
                  <LineChart
                    data={lineData(weekly.map((w) => w.stats.kd))}
                    height={100}
                    thickness={2}
                    color={colors.accent}
                    hideRules
                    hideYAxisText
                    hideAxesAndRules
                    dataPointsColor={colors.accent}
                    dataPointsRadius={3}
                    areaChart
                    startFillColor={colors.accent}
                    startOpacity={0.08}
                    endOpacity={0}
                    xAxisColor="transparent"
                    yAxisColor="transparent"
                    initialSpacing={8}
                    spacing={(320 - 16) / Math.max(weekly.length - 1, 1)}
                    disableScroll
                  />
                </View>
                <View>
                  <ThemedText variant="footnote" color="secondary" style={{ marginBottom: 4 }}>
                    ADR
                  </ThemedText>
                  <LineChart
                    data={lineData(weekly.map((w) => w.stats.avgAdr))}
                    height={100}
                    thickness={2}
                    color={colors.accent}
                    hideRules
                    hideYAxisText
                    hideAxesAndRules
                    dataPointsColor={colors.accent}
                    dataPointsRadius={3}
                    areaChart
                    startFillColor={colors.accent}
                    startOpacity={0.08}
                    endOpacity={0}
                    xAxisColor="transparent"
                    yAxisColor="transparent"
                    initialSpacing={8}
                    spacing={(320 - 16) / Math.max(weekly.length - 1, 1)}
                    disableScroll
                  />
                </View>
                <View>
                  <ThemedText variant="footnote" color="secondary" style={{ marginBottom: 4 }}>
                    HS%
                  </ThemedText>
                  <LineChart
                    data={lineData(weekly.map((w) => w.stats.avgHsPercent))}
                    height={100}
                    thickness={2}
                    color={colors.accent}
                    hideRules
                    hideYAxisText
                    hideAxesAndRules
                    dataPointsColor={colors.accent}
                    dataPointsRadius={3}
                    areaChart
                    startFillColor={colors.accent}
                    startOpacity={0.08}
                    endOpacity={0}
                    xAxisColor="transparent"
                    yAxisColor="transparent"
                    initialSpacing={8}
                    spacing={(320 - 16) / Math.max(weekly.length - 1, 1)}
                    disableScroll
                  />
                </View>
              </Card>
            </View>
          )}

          {mapStats.length > 0 && (
            <View>
              <ThemedText variant="headline" style={{ marginBottom: Spacing.sm }}>
                Par map
              </ThemedText>
              <Card style={{ gap: 0 }}>
                {mapStats.map((m) => (
                  <MapPerformanceRow key={m.map} stats={m} />
                ))}
              </Card>
            </View>
          )}

          {sessions.length === 0 && (
            <Card>
              <ThemedText color="secondary" style={{ textAlign: 'center' }}>
                Logge ta première session pour voir tes statistiques ici.
              </ThemedText>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
