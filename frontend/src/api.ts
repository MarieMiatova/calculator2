import { API_BASE_URL } from "./config";
import type { HistoryEntry } from "./types";

export async function fetchHistory(): Promise<HistoryEntry[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/history`);
    if (!res.ok) return [];
    const json = (await res.json()) as HistoryEntry[];
    return json;
  } catch (e) {
    console.error("fetchHistory error", e);
    return [];
  }
}

export async function postHistory(entry: HistoryEntry): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch (e) {
    console.error("postHistory error", e);
  }
}
