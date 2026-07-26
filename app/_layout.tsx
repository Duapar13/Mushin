import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { DB_NAME, migrateDb } from '../db/schema';
import { DataProvider } from '../context/DataContext';
import { NotificationSync } from '../components/NotificationSync';
import { SplashView } from '../components/SplashView';
import { useTheme } from '../hooks/useTheme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const [showAppSplash, setShowAppSplash] = useState(true);
  const { scheme, colors } = useTheme();

  const onLayoutReady = useCallback(async () => {
    if (!fontsLoaded) return;
    await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutReady();
  }, [onLayoutReady]);

  useEffect(() => {
    if (!fontsLoaded) return;
    const timer = setTimeout(() => setShowAppSplash(false), 700);
    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <SQLiteProvider databaseName={DB_NAME} onInit={migrateDb}>
        <DataProvider>
          <NotificationSync />
          {showAppSplash ? (
            <SplashView />
          ) : (
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="session/[id]"
                options={{
                  presentation: 'modal',
                  title: 'Modifier la session',
                }}
              />
            </Stack>
          )}
        </DataProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
