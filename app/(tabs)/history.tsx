import { Pressable, SectionList, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../constants/theme';
import { Session } from '../../types';

function groupByDate(sessions: Session[]) {
  const groups = new Map<string, Session[]>();
  for (const s of sessions) {
    const key = new Date(s.playedAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const list = groups.get(key) ?? [];
    list.push(s);
    groups.set(key, list);
  }
  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}

const RESULT_LABEL: Record<Session['result'], string> = {
  win: 'Victoire',
  loss: 'Défaite',
  draw: 'Égalité',
};

function SessionRow({ session }: { session: Session }) {
  const { colors } = useTheme();
  const kd = session.deaths > 0 ? session.kills / session.deaths : session.kills;

  return (
    <Pressable
      onPress={() => router.push(`/session/${session.id}`)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
        gap: Spacing.md,
      }}
    >
      <View
        style={{
          width: 6,
          height: 36,
          borderRadius: Radius.pill,
          backgroundColor:
            session.result === 'win'
              ? colors.text
              : session.result === 'loss'
                ? colors.textTertiary
                : colors.textSecondary,
        }}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText variant="body" weight="600">
          {session.map} · {RESULT_LABEL[session.result]}
        </ThemedText>
        <ThemedText variant="footnote" color="secondary">
          {kd.toFixed(2)} K/D · {session.adr.toFixed(0)} ADR · {session.hsPercent.toFixed(0)}% HS
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function HistoryScreen() {
  const { sessions } = useData();
  const { colors } = useTheme();
  const sections = groupByDate(sessions);

  return (
    <ThemedView variant="grouped" style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ThemedText
          variant="largeTitle"
          style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.sm }}
        >
          Historique
        </ThemedText>
        {sessions.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <ThemedText color="secondary">Aucune session enregistrée.</ThemedText>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <SessionRow session={item} />}
            renderSectionHeader={({ section }) => (
              <View
                style={{
                  backgroundColor: colors.groupedBackground,
                  paddingHorizontal: Spacing.lg,
                  paddingTop: Spacing.md,
                  paddingBottom: Spacing.xs,
                }}
              >
                <ThemedText variant="footnote" color="secondary" style={{ textTransform: 'capitalize' }}>
                  {section.title}
                </ThemedText>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: Spacing.xl }}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
