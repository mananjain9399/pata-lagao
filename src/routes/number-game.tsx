import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, RotateCcw, Trophy, ArrowDown, ArrowUp, Check, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { sfx, speak, stopSpeak } from "@/lib/sound";
import { Confetti } from "@/components/Confetti";
import { useAuth } from "@/lib/use-auth";
import { recordScore } from "@/lib/leaderboard";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/number-game")({
  head: () => ({ meta: [{ title: "Number Guess — GuessVerse" }] }),
  component: NumberGame,
});

interface Level {
  n: number;
  name: string;
  min: number;
  max: number;
  attempts: number;
  unlockAt: number; // points required to unlock
}

const LEVELS: Level[] = [
  { n: 1,  name: "Spark",       min: 1,   max: 10,    attempts: 5,  unlockAt: 0 },
  { n: 2,  name: "Glow",        min: 1,   max: 25,    attempts: 6,  unlockAt: 30 },
  { n: 3,  name: "Pulse",       min: 1,   max: 50,    attempts: 7,  unlockAt: 80 },
  { n: 4,  name: "Wave",        min: 1,   max: 100,   attempts: 7,  unlockAt: 150 },
  { n: 5,  name: "Storm",       min: 1,   max: 200,   attempts: 8,  unlockAt: 240 },
  { n: 6,  name: "Nebula",      min: 1,   max: 500,   attempts: 9,  unlockAt: 360 },
  { n: 7,  name: "Quasar",      min: 1,   max: 1000,  attempts: 10, unlockAt: 520 },
  { n: 8,  name: "Vortex",      min: 1,   max: 2500,  attempts: 11, unlockAt: 720 },
  { n: 9,  name: "Singularity", min: 1,   max: 5000,  attempts: 12, unlockAt: 980 },
  { n: 10, name: "Infinity",    min: 1,   max: 10000, attempts: 14, unlockAt: 1300 },
];

const STORAGE_KEY = "number-game-progress";

interface Progress { points: number; highest: number; }

function loadProgress(): Progress {
  if (typeof window === "undefined") return { points: 0, highest: 1 };
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "") || { points: 0, highest: 1 }; }
  catch { return { points: 0, highest: 1 }; }
}

function NumberGame() {
  const { muted } = useSettings();
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress>({ points: 0, highest: 1 });
  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];
  const [target, setTarget] = useState(1);
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState<{ g: number; cmp: "low" | "high" | "ok" }[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(level.attempts);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => { setProgress(loadProgress()); }, []);

  // On first load only, jump to highest unlocked level. Don't snap back on every win —
  // that was wiping the "Correct!" screen before users could click Next level.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const p = loadProgress();
    const idx = LEVELS.findIndex((l) => l.n === p.highest);
    if (idx >= 0) setLevelIdx(idx);
  }, []);

  // start round whenever level changes
  useEffect(() => {
    const t = Math.floor(Math.random() * (level.max - level.min + 1)) + level.min;
    setTarget(t);
    setGuess("");
    setHistory([]);
    setAttemptsLeft(level.attempts);
    setStatus("playing");
    speak(
      `Level ${level.n}, ${level.name}. Guess a number between ${level.min} and ${level.max}. You have ${level.attempts} tries.`,
      muted,
    );
    return () => stopSpeak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIdx]);

  const isUnlocked = (l: Level) => progress.points >= l.unlockAt;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "playing") return;
    const g = parseInt(guess, 10);
    if (Number.isNaN(g) || g < level.min || g > level.max) {
      toast.error(`Enter a number between ${level.min} and ${level.max}`);
      return;
    }
    const left = attemptsLeft - 1;
    if (g === target) {
      const earned = level.n * 10 + left * 5 + 10;
      const next: Progress = {
        points: progress.points + earned,
        highest: Math.max(progress.highest, level.n),
      };
      // unlock next level if we crossed threshold
      const unlocked = LEVELS.find((l) => l.n === level.n + 1 && next.points >= l.unlockAt);
      if (unlocked) next.highest = Math.max(next.highest, unlocked.n);
      setProgress(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setHistory((h) => [...h, { g, cmp: "ok" }]);
      setStatus("won");
      setCelebrate(true);
      sfx.win(muted);
      speak(`Correct! You earned ${earned} points.`, muted);
      setTimeout(() => setCelebrate(false), 3500);
      if (unlocked) {
        sfx.unlock(muted);
        toast.success(`Level ${unlocked.n} ${unlocked.name} unlocked!`);
      }
      if (user) {
        recordScore("number", next.points, next.highest).catch(() => {});
      }
      return;
    }
    setHistory((h) => [...h, { g, cmp: g < target ? "low" : "high" }]);
    setAttemptsLeft(left);
    setGuess("");
    if (g < target) sfx.high(muted); else sfx.low(muted);
    if (left <= 0) {
      setStatus("lost");
      sfx.wrong(muted);
      speak(`Out of tries. The number was ${target}.`, muted);
    }
  };

  const restart = () => {
    setLevelIdx(levelIdx); // re-trigger effect
    const t = Math.floor(Math.random() * (level.max - level.min + 1)) + level.min;
    setTarget(t);
    setGuess("");
    setHistory([]);
    setAttemptsLeft(level.attempts);
    setStatus("playing");
    sfx.click(muted);
  };

  const nextLocked = LEVELS.find((l) => !isUnlocked(l));
  const progressToNext = useMemo(() => {
    if (!nextLocked) return 100;
    const prev = LEVELS.filter((l) => isUnlocked(l)).pop()?.unlockAt ?? 0;
    return Math.min(100, ((progress.points - prev) / (nextLocked.unlockAt - prev)) * 100);
  }, [progress.points, nextLocked]);

  return (
    <div className="theme-number max-w-5xl mx-auto px-4 pt-8 pb-20">
      <Confetti show={celebrate} />

      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Number <span className="text-aurora">Guess</span></h1>
          <p className="text-muted-foreground">10 levels · earn points · unlock the next</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-2xl px-4 py-2 text-sm">
            <span className="text-muted-foreground">Points</span>
            <span className="ml-2 font-bold text-aurora">{progress.points}</span>
          </div>
          <Link to="/leaderboard" className="glass rounded-2xl px-4 py-2 text-sm flex items-center gap-2 hover:scale-105 transition">
            <Trophy className="w-4 h-4 text-accent" /> Leaderboard
          </Link>
        </div>
      </div>

      {/* level selector */}
      <div className="mt-6 grid grid-cols-5 sm:grid-cols-10 gap-2">
        {LEVELS.map((l, i) => {
          const unlocked = isUnlocked(l);
          const active = i === levelIdx;
          return (
            <button
              key={l.n}
              disabled={!unlocked}
              onClick={() => { setLevelIdx(i); sfx.click(muted); }}
              className={`aspect-square rounded-xl text-sm font-bold transition relative
                ${active ? "bg-aurora text-primary-foreground shadow-lg scale-105" : ""}
                ${unlocked && !active ? "glass hover:scale-105" : ""}
                ${!unlocked ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed" : ""}`}
              title={`Level ${l.n} — ${l.name}${unlocked ? "" : ` (unlock at ${l.unlockAt} pts)`}`}
            >
              {unlocked ? l.n : <Lock className="w-3.5 h-3.5 mx-auto" />}
            </button>
          );
        })}
      </div>

      {/* unlock progress bar */}
      {nextLocked && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Next: Level {nextLocked.n} · {nextLocked.name}</span>
            <span>{progress.points} / {nextLocked.unlockAt} pts</span>
          </div>
          <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
            <div className="h-full bg-aurora transition-all duration-500" style={{ width: `${progressToNext}%` }} />
          </div>
        </div>
      )}

      {/* play card */}
      <div className="mt-8 grid md:grid-cols-[1.4fr_1fr] gap-6">
        <div className="glass-3d rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Level {level.n}</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" /> {level.name}
              </div>
            </div>
            <button onClick={restart} className="glass rounded-full px-3 py-2 text-xs flex items-center gap-1 hover:scale-105 transition">
              <RotateCcw className="w-3.5 h-3.5" /> New round
            </button>
          </div>

          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">Pick a number between</div>
            <div className="text-5xl md:text-6xl font-bold mt-2">
              <span className="text-aurora">{level.min}</span>
              <span className="text-muted-foreground/50 mx-3">—</span>
              <span className="text-aurora">{level.max}</span>
            </div>
            <div className="mt-4 text-sm">
              Attempts left: <span className="font-bold text-foreground">{attemptsLeft}</span> / {level.attempts}
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 flex gap-2">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={status !== "playing"}
              min={level.min}
              max={level.max}
              placeholder="Your guess"
              className="flex-1 px-5 py-4 rounded-2xl bg-input border border-border text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status !== "playing"}
              className="px-6 py-4 rounded-2xl bg-aurora font-semibold text-primary-foreground disabled:opacity-50 hover:scale-[1.02] transition"
            >
              Guess
            </button>
          </form>

          {status === "won" && (
            <div className="mt-6 glass rounded-2xl p-4 text-center animate-pop">
              <div className="text-2xl">🎉 Correct!</div>
              <div className="text-sm text-muted-foreground">The number was {target}.</div>
              <div className="mt-3 flex justify-center gap-2">
                <button onClick={restart} className="px-4 py-2 rounded-xl glass text-sm">Play again</button>
                {LEVELS[levelIdx + 1] && isUnlocked(LEVELS[levelIdx + 1]) && (
                  <button onClick={() => { setLevelIdx(levelIdx + 1); sfx.click(muted); }}
                    className="px-4 py-2 rounded-xl bg-aurora text-primary-foreground text-sm font-semibold">
                    Next level →
                  </button>
                )}
              </div>
            </div>
          )}
          {status === "lost" && (
            <div className="mt-6 glass rounded-2xl p-4 text-center animate-shake">
              <div className="text-2xl">💔 Out of tries</div>
              <div className="text-sm text-muted-foreground">The number was {target}.</div>
              <button onClick={restart} className="mt-3 px-4 py-2 rounded-xl bg-aurora text-primary-foreground text-sm font-semibold">
                Try again
              </button>
            </div>
          )}
        </div>

        <div className="glass-3d rounded-3xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Hints</h3>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your guesses will appear here with up/down hints.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((h, i) => (
                <li key={i} className="flex items-center justify-between glass rounded-xl px-3 py-2 text-sm">
                  <span className="font-mono font-bold">{h.g}</span>
                  {h.cmp === "ok" && <span className="text-success">✓ Correct</span>}
                  {h.cmp === "low" && <span className="flex items-center gap-1 text-secondary"><ArrowUp className="w-3.5 h-3.5"/> Higher</span>}
                  {h.cmp === "high" && <span className="flex items-center gap-1 text-primary"><ArrowDown className="w-3.5 h-3.5"/> Lower</span>}
                </li>
              ))}
            </ul>
          )}
          {!user && (
            <Link to="/auth" className="mt-6 block text-center text-xs glass rounded-xl py-2 hover:scale-[1.02] transition">
              Sign in to save your score on the global leaderboard →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
