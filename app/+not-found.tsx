import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Spacing } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oups' }} />
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md }}>
          <ThemedText variant="title2">Cette page n’existe pas.</ThemedText>
          <Link href="/">
            <ThemedText color="accent">Retour au dashboard</ThemedText>
          </Link>
        </View>
      </ThemedView>
    </>
  );
}
