import type { SQLiteDatabase } from 'expo-sqlite';
import { Goal, GoalInput } from '../types';

export async function getAllGoals(db: SQLiteDatabase): Promise<Goal[]> {
  return db.getAllAsync<Goal>('SELECT * FROM goals ORDER BY createdAt DESC');
}

export async function insertGoal(
  db: SQLiteDatabase,
  input: GoalInput
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO goals (metric, label, targetValue, targetLabel, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    input.metric,
    input.label,
    input.targetValue,
    input.targetLabel,
    now
  );
  return result.lastInsertRowId;
}

export async function deleteGoal(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM goals WHERE id = ?', id);
}
