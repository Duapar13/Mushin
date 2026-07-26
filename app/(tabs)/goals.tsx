import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MushinWordmark } from '../../components/MushinWordmark';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { AddGoalModal } from '../../components/AddGoalModal';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from '../../constants/theme';
import { computePeriodStats, sessionsInLastDays } from '../../utils/stats';
import { computeGoalProgress } from '../../utils/goalProgress';
import { formatRank } from '../../utils/rank';

export default function GoalsScreen() {
  const { sessions, goals, addGoal, removeGoal } = useData();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const recentStats = computePeriodStats(sessionsInLastDays(sessions, 30));
  const latestRank = sessions[0] ? formatRank(sessions[0]) : undefined;

  const handleDelete = (id: number, label: string) => {
    Alert.alert('Supprimer l’objectif', label, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => removeGoal(id) },
    ]);
  };

  return (
    <ThemedView variant="grouped" style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.sm,
          }}
        >
          <MushinWordmark size={36} />
          <Pressable onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={30} color={colors.accent} />
          </Pressable>
        </View>

        {goals.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: Spacing.lg }}>
            <ThemedText color="secondary" style={{ textAlign: 'center' }}>
              Aucun objectif défini. Ajoute une cible (win rate, K/D, ADR…) pour suivre ta progression.
            </ThemedText>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}>
            {goals.map((goal) => {
              const progress = computeGoalProgress(goal, recentStats, latestRank);
              return (
                <Card key={goal.id} style={{ gap: Spacing.sm }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <ThemedText variant="headline">
                      {goal.label} · {goal.metric === 'rank' ? goal.targetLabel : goal.targetValue}
                    </ThemedText>
                    <Pressable onPress={() => handleDelete(goal.id, goal.label)}>
                      <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
                    </Pressable>
                  </View>

                  {goal.metric === 'rank' ? (
                    <ThemedText color="secondary">
                      Actuel : {progress.currentLabel} → Visé : {goal.targetLabel}
                    </ThemedText>
                  ) : (
                    <>
                      <ProgressBar progress={progress.progress} />
                      <ThemedText variant="footnote" color="secondary">
                        {progress.currentLabel} / {goal.targetValue}
                        {goal.metric === 'winRate' || goal.metric === 'hsPercent' ? '%' : ''}
                        {'  ·  30 derniers jours'}
                      </ThemedText>
                    </>
                  )}
                </Card>
              );
            })}
          </ScrollView>
        )}

        <AddGoalModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={addGoal}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
