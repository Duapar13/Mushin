import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MushinWordmark } from '../../components/MushinWordmark';
import { SessionForm } from '../../components/SessionForm';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useData } from '../../context/DataContext';
import { Spacing } from '../../constants/theme';
import { SessionInput } from '../../types';

export default function NewSessionScreen() {
  const { addSession } = useData();
  const [justSaved, setJustSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleSubmit = async (input: SessionInput) => {
    await addSession(input);
    setJustSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <ThemedView variant="grouped" style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.sm,
          }}
        >
          <MushinWordmark size={36} />
          {justSaved && (
            <ThemedText variant="footnote" weight="600" color="accent">
              Session enregistrée ✓
            </ThemedText>
          )}
        </View>
        <SessionForm onSubmit={handleSubmit} submitLabel="Enregistrer la session" />
      </SafeAreaView>
    </ThemedView>
  );
}
