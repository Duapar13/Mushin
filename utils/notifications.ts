import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Session } from '../types';

const REMINDER_ID = 'mushin-daily-streak-reminder';
const REMINDER_HOUR = 20;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function hasSessionToday(sessions: Session[]): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return sessions.some((s) => s.playedAt.slice(0, 10) === today);
}

// Reschedules the "you haven't logged a session yet" reminder based on
// today's data. Called on app start and after every session write, since
// a fixed repeating trigger can't be skipped for a single day.
export async function syncDailyReminder(sessions: Session[]): Promise<void> {
  const granted = await ensureNotificationPermission();
  if (!granted) return;

  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(
    () => {}
  );

  const target = new Date();
  target.setHours(REMINDER_HOUR, 0, 0, 0);
  const loggedToday = hasSessionToday(sessions);

  if (loggedToday || target.getTime() <= Date.now()) {
    target.setDate(target.getDate() + 1);
  }

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: {
      title: 'Mushin',
      body: "Pas encore de session loggée aujourd'hui — garde ton streak vivant.",
      sound: Platform.OS === 'ios' ? undefined : undefined,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: target,
    },
  });
}
