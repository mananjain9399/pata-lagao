import { allPuzzles, type WordPuzzle } from "./word-data";

const STREAK_KEY = "pl-daily-streak";
const LAST_KEY = "pl-daily-last";   // YYYY-MM-DD of last completed challenge
const DONE_KEY = "pl-daily-done";   // YYYY-MM-DD of today if solved

export interface StreakState {
  streak: number;
  lastDate: string | null;
  doneToday: boolean;
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export function loadStreak(): StreakState {
  if (typeof window === "undefined") return { streak: 0, lastDate: null, doneToday: false };
  const streak = Number(localStorage.getItem(STREAK_KEY) || "0");
  const lastDate = localStorage.getItem(LAST_KEY);
  const doneToday = localStorage.getItem(DONE_KEY) === todayKey();
  // if more than one day has passed, streak resets on next play
  let s = streak;
  if (lastDate && lastDate !== todayKey() && lastDate !== yesterdayOf(todayKey())) s = 0;
  return { streak: s, lastDate, doneToday };
}

export function markDailyWin(): StreakState {
  if (typeof window === "undefined") return { streak: 1, lastDate: todayKey(), doneToday: true };
  const today = todayKey();
  const prev = loadStreak();
  if (prev.doneToday) return prev;
  const newStreak = prev.lastDate === yesterdayOf(today) ? prev.streak + 1 : 1;
  localStorage.setItem(STREAK_KEY, String(newStreak));
  localStorage.setItem(LAST_KEY, today);
  localStorage.setItem(DONE_KEY, today);
  return { streak: newStreak, lastDate: today, doneToday: true };
}

// Difficulty tier: harder as streak grows
export function tierFromStreak(streak: number): 1 | 2 | 3 {
  if (streak >= 7) return 3;
  if (streak >= 3) return 2;
  return 1;
}

// Stable seed → puzzle index
function seededIndex(seedStr: string, len: number) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % len;
}

export function getDailyPuzzle(streak: number): WordPuzzle {
  const tier = tierFromStreak(streak);
  const pool = allPuzzles.filter((p) => (p.difficulty ?? 1) === tier);
  const list = pool.length ? pool : allPuzzles;
  return list[seededIndex(todayKey() + ":" + tier, list.length)];
}
