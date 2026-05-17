import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, RotateCcw, Trophy, Lightbulb, Volume2, Flame, CalendarCheck } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { sfx, speak, stopSpeak } from "@/lib/sound";
import { Confetti } from "@/components/Confetti";
import { wordCategories, categoryKeys, type WordPuzzle } from "@/lib/word-data";
import { useAuth } from "@/lib/use-auth";
import { recordScore } from "@/lib/leaderboard";
import { toast } from "sonner";
import { getDailyPuzzle, loadStreak, markDailyWin, tierFromStreak, todayKey, type StreakState } from "@/lib/daily";

export const Route = createFileRoute("/word-game")({
  head: () => ({ meta: [{ title: "Word Hunt — PataLagao" }] }),
  component: WordGame,
});

const STORAGE_KEY = "word-game-progress";
interface Progress { points: number; highest: number; }
function load(): Progress {
  if (typeof window === "undefined") return { points: 0, highest: 1 };
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "") || { points: 0, highest: 1 }; }
  catch { return { points: 0, highest: 1 }; }
}

// Generate unlimited level thresholds: cheap early levels, scaling cost
function thresholdFor(idx: number) {
  if (idx === 0) return 0;
  // 0, 25, 60, 110, 180, 270, 380, 510, 660, 830, ...
  return Math.round(25 * idx + 5 * idx * idx);
}
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

type Mode = "category" | "daily";

function WordGame() {
  const { muted } = useSettings();
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress>({ points: 0, highest: 1 });
  const [mode, setMode] = useState<Mode>("category");
  const [category, setCategory] = useState<string>(categoryKeys[0]);
  const [levelIdx, setLevelIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [attempts, setAttempts] = useState(3);
  const [celebrate, setCelebrate] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState<StreakState>({ streak: 0, lastDate: null, doneToday: false });

  // Per-session shuffle seed — new random order every time the game opens
  const sessionSeed = useMemo(() => Math.random(), []);
  const rawCat = wordCategories[category];
  const shuffledPuzzles = useMemo(() => {
    const arr = [...rawCat.puzzles];
    // Fisher–Yates seeded by sessionSeed + category
    let s = Math.floor(sessionSeed * 1e9) ^ category.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [rawCat, category, sessionSeed]);
  const cat = { ...rawCat, puzzles: shuffledPuzzles };
  const dailyPuzzle = useMemo(() => getDailyPuzzle(streak.streak), [streak.streak]);
  const puzzle: WordPuzzle = mode === "daily" ? dailyPuzzle : cat.puzzles[levelIdx];
  const totalLevels = cat.puzzles.length;

  useEffect(() => { setProgress(load()); setStreak(loadStreak()); }, []);

  useEffect(() => {
    setGuess("");
    setRevealed(new Array(puzzle.answer.length).fill(""));
    setStatus("playing");
    setAttempts(3);
    setShowHint(false);
    const intro = mode === "daily"
      ? `Daily challenge! ${puzzle.hint}`
      : `${cat.label}, level ${levelIdx + 1}. ${puzzle.hint}`;
    speak(intro, muted);
    return () => stopSpeak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, category, levelIdx, dailyPuzzle.answer]);

  const isLevelUnlocked = (idx: number) => progress.points >= thresholdFor(idx);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "playing") return;
    if (normalize(guess) === normalize(puzzle.answer)) {
      const base = mode === "daily" ? 30 + streak.streak * 5 : (levelIdx + 1) * 8 + 6;
      const earned = base + attempts * 4;
      const next = {
        points: progress.points + earned,
        highest: Math.max(progress.highest, mode === "daily" ? progress.highest : levelIdx + 1),
      };
      setProgress(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStatus("won");
      setCelebrate(true);
      sfx.win(muted);
      speak(`Yay! Correct! The word was ${puzzle.answer}. You earned ${earned} points.`, muted);
      setTimeout(() => setCelebrate(false), 3500);
      if (mode === "daily" && !streak.doneToday) {
        const ns = markDailyWin();
        setStreak(ns);
        toast.success(`🔥 Daily streak: ${ns.streak} day${ns.streak === 1 ? "" : "s"}!`);
      } else if (mode === "category") {
        // detect any newly crossed threshold
        for (let i = levelIdx + 1; i < cat.puzzles.length; i++) {
          const t = thresholdFor(i);
          if (progress.points < t && next.points >= t) {
            sfx.unlock(muted);
            toast.success(`Level ${i + 1} unlocked!`);
            break;
          }
        }
      }
      if (user) recordScore("word", next.points, next.highest).catch(() => {});
      return;
    }
    const left = attempts - 1;
    setAttempts(left);
    sfx.wrong(muted);
    if (left <= 0) {
      setStatus("lost");
      speak(`Out of tries. The answer was ${puzzle.answer}.`, muted);
    } else {
      const arr = [...revealed];
      const empty = puzzle.answer.split("").map((_, i) => i).filter((i) => !arr[i]);
      if (empty.length) {
        const pick = empty[Math.floor(Math.random() * empty.length)];
        arr[pick] = puzzle.answer[pick];
        setRevealed(arr);
      }
      toast(`Try again — ${left} ${left === 1 ? "try" : "tries"} left`);
    }
    setGuess("");
  };

  const reveal = useMemo(() => {
    if (status === "won" || status === "lost") return puzzle.answer.toUpperCase().split("");
    return revealed.map((c, i) => (c ? puzzle.answer[i].toUpperCase() : ""));
  }, [revealed, status, puzzle.answer]);

  const useHint = () => {
    if (showHint) return;
    setShowHint(true);
    sfx.click(muted);
    speak(`Hint: ${puzzle.hintWord}`, muted);
  };

  return (
    <div className="theme-word max-w-5xl mx-auto px-4 pt-8 pb-20">
      <Confetti show={celebrate} />

      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Word <span className="text-aurora">Hunt</span></h1>
          <p className="text-muted-foreground">Ek sentence. Ek word. Pata lagao! 🎯</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-2xl px-4 py-2 text-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-muted-foreground">Streak</span>
            <span className="font-bold text-aurora">{streak.streak}</span>
          </div>
          <div className="glass rounded-2xl px-4 py-2 text-sm">
            <span className="text-muted-foreground">Points</span>
            <span className="ml-2 font-bold text-aurora">{progress.points}</span>
          </div>
          <Link to="/leaderboard" className="glass rounded-2xl px-4 py-2 text-sm flex items-center gap-2 hover:scale-105 transition">
            <Trophy className="w-4 h-4 text-accent" /> Leaderboard
          </Link>
        </div>
      </div>

      {/* mode tabs */}
      <div className="mt-6 inline-flex gap-1 p-1 rounded-full glass">
        <button
          onClick={() => { setMode("category"); sfx.click(muted); }}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${mode === "category" ? "bg-aurora text-primary-foreground shadow" : "text-muted-foreground"}`}
        >
          🎯 Categories
        </button>
        <button
          onClick={() => { setMode("daily"); sfx.click(muted); }}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1 ${mode === "daily" ? "bg-aurora text-primary-foreground shadow" : "text-muted-foreground"}`}
        >
          <CalendarCheck className="w-4 h-4" /> Daily Challenge
          {streak.doneToday && <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-success text-success-foreground">✓</span>}
        </button>
      </div>

      {mode === "category" ? (
        <>
          {/* category chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categoryKeys.map((k) => {
              const c = wordCategories[k];
              const active = k === category;
              return (
                <button
                  key={k}
                  onClick={() => { setCategory(k); setLevelIdx(0); sfx.click(muted); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    active ? "bg-aurora text-primary-foreground shadow-lg" : "glass hover:scale-105"
                  }`}
                >
                  <span className="mr-1.5 text-base">{c.emoji}</span>{c.label}
                </button>
              );
            })}
          </div>

          {/* level pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {cat.puzzles.map((_, i) => {
              const unlocked = isLevelUnlocked(i);
              const active = i === levelIdx;
              return (
                <button
                  key={i}
                  disabled={!unlocked}
                  onClick={() => { setLevelIdx(i); sfx.click(muted); }}
                  className={`w-10 h-10 rounded-2xl text-sm font-bold transition relative
                    ${active ? "bg-aurora text-primary-foreground shadow-lg scale-105" : ""}
                    ${unlocked && !active ? "glass hover:scale-105" : ""}
                    ${!unlocked ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed" : ""}`}
                  title={unlocked ? `Level ${i + 1}` : `Unlock at ${thresholdFor(i)} pts`}
                >
                  {unlocked ? i + 1 : <Lock className="w-3.5 h-3.5 mx-auto" />}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="mt-6 glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm">
            <div className="font-semibold">Today · {todayKey()}</div>
            <div className="text-muted-foreground">
              Difficulty <span className="text-aurora font-bold">Tier {tierFromStreak(streak.streak)}</span> · gets harder as your streak grows 🔥
            </div>
          </div>
          {streak.doneToday && (
            <div className="text-sm text-success font-semibold">Already solved today — come back tomorrow!</div>
          )}
        </div>
      )}

      {/* puzzle card */}
      <div className="mt-8 glass-3d rounded-3xl p-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {mode === "daily" ? "Daily Challenge" : `${cat.label} · Level ${levelIdx + 1}/${totalLevels}`}
            </div>
            <div className="text-lg font-semibold flex items-center gap-2 mt-1">
              <Lightbulb className="w-5 h-5 text-accent" /> Sentence
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => speak(`${puzzle.hint}. ${puzzle.hindi}`, muted)}
              className="glass rounded-full px-3 py-2 text-xs flex items-center gap-1 hover:scale-105 transition"
            >
              <Volume2 className="w-3.5 h-3.5" /> Read aloud
            </button>
            <button
              onClick={useHint}
              disabled={showHint || status !== "playing"}
              className="rounded-full px-3 py-2 text-xs flex items-center gap-1 hover:scale-105 transition bg-accent text-accent-foreground font-semibold disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5" /> Use Hint
            </button>
          </div>
        </div>

        <p className="mt-3 text-2xl md:text-3xl font-display leading-snug">
          “{puzzle.hint}”
        </p>
        <p className="mt-2 text-base md:text-lg text-muted-foreground" lang="hi">
          🇮🇳 {puzzle.hindi}
        </p>

        {showHint && (
          <div className="mt-4 glass rounded-2xl p-4 text-sm flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold">Hint</div>
              <div className="text-muted-foreground">{puzzle.hintWord}</div>
            </div>
          </div>
        )}

        {/* letter reveal */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {puzzle.answer.split("").map((_, i) => (
            <div
              key={i}
              className={`w-10 h-12 md:w-12 md:h-14 rounded-2xl glass grid place-items-center text-xl md:text-2xl font-bold ${
                reveal[i] ? "text-aurora" : ""
              }`}
            >
              {reveal[i] || ""}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 flex gap-2 max-w-md mx-auto">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={status !== "playing"}
            autoFocus
            placeholder="One-word answer..."
            className="flex-1 px-5 py-4 rounded-2xl bg-input border border-border text-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status !== "playing"}
            className="px-6 py-4 rounded-2xl bg-aurora font-semibold text-primary-foreground disabled:opacity-50 hover:scale-[1.02] transition"
          >
            Guess
          </button>
        </form>

        <div className="mt-3 text-center text-sm text-muted-foreground">
          Tries left: <span className="font-bold text-foreground">{attempts}</span> · each wrong reveals a letter
        </div>

        {status === "won" && (
          <div className="mt-6 glass rounded-2xl p-4 text-center animate-pop">
            <div className="text-xl">🎉 Shabaash!</div>
            <div className="text-sm text-muted-foreground">The word was <b className="uppercase">{puzzle.answer}</b>.</div>
            {mode === "category" && (
              <div className="mt-3 flex justify-center gap-2 flex-wrap">
                {levelIdx + 1 < totalLevels && isLevelUnlocked(levelIdx + 1) ? (
                  <button onClick={() => { setLevelIdx(levelIdx + 1); sfx.click(muted); }}
                    className="px-4 py-2 rounded-2xl bg-aurora text-primary-foreground text-sm font-semibold">
                    Next puzzle →
                  </button>
                ) : (
                  <button onClick={() => { setLevelIdx(0); sfx.click(muted); }}
                    className="px-4 py-2 rounded-2xl bg-aurora text-primary-foreground text-sm font-semibold">
                    Play again →
                  </button>
                )}
                {levelIdx + 1 < totalLevels && !isLevelUnlocked(levelIdx + 1) && (
                  <span className="px-3 py-2 text-xs text-muted-foreground">
                    Next level unlocks at {thresholdFor(levelIdx + 1)} pts
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        {status === "lost" && (
          <div className="mt-6 glass rounded-2xl p-4 text-center animate-shake">
            <div className="text-xl">💔 Oops!</div>
            <div className="text-sm text-muted-foreground">The answer was <b className="uppercase">{puzzle.answer}</b>.</div>
            {mode === "category" && (
              <button onClick={() => { setStatus("playing"); setAttempts(3); setRevealed(new Array(puzzle.answer.length).fill("")); setShowHint(false); sfx.click(muted); }}
                className="mt-3 px-4 py-2 rounded-2xl bg-aurora text-primary-foreground text-sm font-semibold inline-flex items-center gap-1">
                <RotateCcw className="w-4 h-4" /> Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
