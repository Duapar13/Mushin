import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionForm } from '../../components/SessionForm';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useData } from '../../context/DataContext';
import { Spacing } from '../../constants/theme';
import { SessionInput } from '../../types';

export default function NewSessionScreen() {
  const { addSession } = useData();

  const handleSubmit = async (input: SessionInput) => {
    await addSession(input);
    router.push('/');
  };

  return (
    <ThemedView variant="grouped" style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ThemedText
          variant="largeTitle"
          style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm }}
        >
          Nouvelle session
        </ThemedText>
        <SessionForm onSubmit={handleSubmit} submitLabel="Enregistrer la session" />
      </SafeAreaView>
    </ThemedView>
  );
}
