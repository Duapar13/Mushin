import { useMemo } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SessionForm } from '../../components/SessionForm';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { useData } from '../../context/DataContext';
import { SessionInput } from '../../types';

export default function EditSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions, editSession, removeSession } = useData();

  const session = useMemo(
    () => sessions.find((s) => s.id === Number(id)),
    [sessions, id]
  );

  if (!session) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText color="secondary">Session introuvable.</ThemedText>
      </ThemedView>
    );
  }

  const handleSubmit = async (input: SessionInput) => {
    await editSession(session.id, input);
    router.back();
  };

  const handleDelete = async () => {
    Alert.alert(
      'Supprimer la session',
      'Cette action est définitive.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await removeSession(session.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ThemedView variant="grouped" style={{ flex: 1 }}>
      <SessionForm
        initial={session}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer les modifications"
        onDelete={handleDelete}
      />
    </ThemedView>
  );
}
