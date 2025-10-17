import { API_BASE_URL } from './config';
import type { HistoryEntry } from './types';
export async function fetchHistory(): Promise<HistoryEntry[]> {
  const res = await fetch(`${API_BASE_URL}/history`);
  if (!res.ok) return [];
  return res.json() as HistoryEntry[];
}
export async function postHistory(entry: HistoryEntry): Promise<void> {
  await fetch(`${API_BASE_URL}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
}