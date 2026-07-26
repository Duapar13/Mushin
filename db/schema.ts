import type { SQLiteDatabase } from 'expo-sqlite';

export const DB_NAME = 'mushin.db';
const CURRENT_VERSION = 3;

export async function migrateDb(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = row?.user_version ?? 0;
  if (currentVersion >= CURRENT_VERSION) return;

  // Pre-release schema changes: rank became structured (Faceit/Premier),
  // focus/tilt before-after scales became a single "ressenti" score, and
  // date/time + session duration were dropped from the form. No real user
  // data predates this, so the old sessions table is simply replaced.
  if (currentVersion > 0 && currentVersion < CURRENT_VERSION) {
    await db.execAsync('DROP TABLE IF EXISTS sessions;');
  }

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
      rankSystem TEXT NOT NULL DEFAULT 'premier',
      rankValue REAL NOT NULL DEFAULT 0,
      feeling INTEGER NOT NULL DEFAULT 5,
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
