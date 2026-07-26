import { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { syncDailyReminder } from '../utils/notifications';

// Headless component: keeps the daily reminder notification in sync
// with whether a session has been logged today.
export function NotificationSync() {
  const { sessions, loading } = useData();

  useEffect(() => {
    if (loading) return;
    syncDailyReminder(sessions).catch(() => {});
  }, [loading, sessions]);

  return null;
}
