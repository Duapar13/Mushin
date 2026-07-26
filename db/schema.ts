import type { SQLiteDatabase } from 'expo-sqlite';

export const DB_NAME = 'mushin.db';
const CURRENT_VERSION = 1;

export async function migrateDb(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = row?.user_version ?? 0;
  if (currentVersion >= CURRENT_VERSION) return;

  await db.execAsync(`
    PRAGMA journal_mode = 'wal';

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY NOT NULL,
      playedAt TEXT NOT NULL,
      map TEXT NOT NULL,
      result TEXT NOT NULL,
      kills INTEGER NOT NULL DEFAULT 0,
      deaths INTEGER NOT NULL DEFAULT 0,
      assists INTEGER NOT NULL DEFAULT 0,
      adr REAL NOT NULL DEFAULT 0,
      hsPercent REAL NOT NULL DEFAULT 0,
      rank TEXT NOT NULL DEFAULT '',
      durationMinutes INTEGER NOT NULL DEFAULT 0,
      focusBefore INTEGER NOT NULL DEFAULT 3,
      focusAfter INTEGER NOT NULL DEFAULT 3,
      tiltBefore INTEGER NOT NULL DEFAULT 1,
      tiltAfter INTEGER NOT NULL DEFAULT 1,
      sleepHours REAL NOT NULL DEFAULT 7,
      notes TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY NOT NULL,
      metric TEXT NOT NULL,
      label TEXT NOT NULL,
      targetValue REAL NOT NULL DEFAULT 0,
      targetLabel TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_playedAt ON sessions (playedAt);
  `);

  await db.execAsync(`PRAGMA user_version = ${CURRENT_VERSION}`);
}
