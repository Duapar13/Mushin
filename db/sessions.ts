import type { SQLiteDatabase } from 'expo-sqlite';
import { Session, SessionInput } from '../types';

export async function getAllSessions(db: SQLiteDatabase): Promise<Session[]> {
  return db.getAllAsync<Session>(
    'SELECT * FROM sessions ORDER BY playedAt DESC'
  );
}

export async function getSessionById(
  db: SQLiteDatabase,
  id: number
): Promise<Session | null> {
  const row = await db.getFirstAsync<Session>(
    'SELECT * FROM sessions WHERE id = ?',
    id
  );
  return row ?? null;
}

export async function insertSession(
  db: SQLiteDatabase,
  input: SessionInput
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO sessions
      (playedAt, map, result, kills, deaths, assists, adr, hsPercent,
       rankSystem, rankValue, feeling, sleepHours, notes,
       createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    input.playedAt,
    input.map,
    input.result,
    input.kills,
    input.deaths,
    input.assists,
    input.adr,
    input.hsPercent,
    input.rankSystem,
    input.rankValue,
    input.feeling,
    input.sleepHours,
    input.notes,
    now,
    now
  );
  return result.lastInsertRowId;
}

export async function updateSession(
  db: SQLiteDatabase,
  id: number,
  input: SessionInput
): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE sessions SET
      playedAt = ?, map = ?, result = ?, kills = ?, deaths = ?, assists = ?,
      adr = ?, hsPercent = ?, rankSystem = ?, rankValue = ?,
      feeling = ?, sleepHours = ?, notes = ?, updatedAt = ?
     WHERE id = ?`,
    input.playedAt,
    input.map,
    input.result,
    input.kills,
    input.deaths,
    input.assists,
    input.adr,
    input.hsPercent,
    input.rankSystem,
    input.rankValue,
    input.feeling,
    input.sleepHours,
    input.notes,
    now,
    id
  );
}

export async function deleteSession(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM sessions WHERE id = ?', id);
}
