import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Goal, GoalInput, Session, SessionInput } from '../types';
import * as sessionsDb from '../db/sessions';
import * as goalsDb from '../db/goals';

interface DataContextValue {
  sessions: Session[];
  goals: Goal[];
  loading: boolean;
  reload: () => Promise<void>;
  addSession: (input: SessionInput) => Promise<void>;
  editSession: (id: number, input: SessionInput) => Promise<void>;
  removeSession: (id: number) => Promise<void>;
  addGoal: (input: GoalInput) => Promise<void>;
  removeGoal: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [allSessions, allGoals] = await Promise.all([
      sessionsDb.getAllSessions(db),
      goalsDb.getAllGoals(db),
    ]);
    setSessions(allSessions);
    setGoals(allGoals);
  }, [db]);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  const addSession = useCallback(
    async (input: SessionInput) => {
      await sessionsDb.insertSession(db, input);
      await reload();
    },
    [db, reload]
  );

  const editSession = useCallback(
    async (id: number, input: SessionInput) => {
      await sessionsDb.updateSession(db, id, input);
      await reload();
    },
    [db, reload]
  );

  const removeSession = useCallback(
    async (id: number) => {
      await sessionsDb.deleteSession(db, id);
      await reload();
    },
    [db, reload]
  );

  const addGoal = useCallback(
    async (input: GoalInput) => {
      await goalsDb.insertGoal(db, input);
      await reload();
    },
    [db, reload]
  );

  const removeGoal = useCallback(
    async (id: number) => {
      await goalsDb.deleteGoal(db, id);
      await reload();
    },
    [db, reload]
  );

  return (
    <DataContext.Provider
      value={{
        sessions,
        goals,
        loading,
        reload,
        addSession,
        editSession,
        removeSession,
        addGoal,
        removeGoal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
