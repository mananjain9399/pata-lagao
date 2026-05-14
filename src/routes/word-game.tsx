import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, RotateCcw, Trophy, Lightbulb, Volume2 } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { sfx, speak, stopSpeak } from "@/lib/sound";
import { Confetti } from "@/components/Confetti";
import { wordCategories, categoryKeys } from "@/lib/word-data";
import { useAuth } from "@/lib/use-auth";
import { recordScore } from "@/lib/leaderboard";
import { toast } from "sonner";

export const Route = createFileRoute("/word-game")({
  head: () => ({ meta: [{ title: "Word Hunt — GuessVerse" }] }),
  component: WordGame,
});

const STORAGE_KEY = "word-game-progress";
interface Progress { points: number; highest: number; }
function load(): Progress {
  if (typeof window === "undefined") return { points: 0, highest: 1 };
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "") || { points: 0, highest: 1 }; }
  catch { return { points: 0, highest: 1 }; }
}

const UNLOCK_THRESHOLDS = [0, 25, 60, 110, 180, 270];

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function WordGame() {
  const { muted } = useSettings();
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress>({ points: 0, highest: 1 });
  const [category, setCategory] = useState<string>(categoryKeys[0]);
  const [levelIdx, setLevelIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]); // hint letters
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [attempts, setAttempts] = useState(3);
  const [celebrate, setCelebrate] = useState(false);

  const cat = wordCategories[category];
  const puzzle = cat.puzzles[levelIdx];
  const totalLevels = cat.puzzles.length;

  useEffect(() => { setProgress(load()); }, []);

  useEffect(() => {
    setGuess("");
    setRevealed(new Array(puzzle.answer.length).fill(""));
    setStatus("playing");
    setAttempts(3);
    speak(`${cat.label}, level ${levelIdx + 1}. ${puzzle.hint}`, muted);
    return () => stopSpeak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, levelIdx]);

  const isLevelUnlocked = (idx: number) => progress.points >= (UNLOCK_THRESHOLDS[idx] ?? 9999);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "playing") return;
    if (normalize(guess) === normalize(puzzle.answer)) {
      const earned = (levelIdx + 1) * 8 + attempts * 4 + 6;
      const next = {
        points: progress.points + earned,
        highest: Math.max(progress.highest, levelIdx + 1),
      };
      setProgress(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStatus("won");
      setCelebrate(true);
      sfx.win(muted);
      speak(`Correct! The word was ${puzzle.answer}. You earned ${earned} points.`, muted);
      setTimeout(() => setCelebrate(false), 3500);
      const newlyUnlocked = UNLOCK_THRESHOLDS.findIndex(
        (t, i) => i > levelIdx && progress.points < t && next.points >= t,
      );
      if (newlyUnlocked > 0) {
        sfx.unlock(muted);
        toast.success(`Level ${newlyUnlocked + 1} unlocked!`);
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
      // reveal one random letter as hint penalty
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

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">
      <Confetti show={celebrate} />

      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Word <span className="text-aurora">Hunt</span></h1>
          <p className="text-muted-foreground">A sentence. One word. Pick a category you love.</p>
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

      {/* category chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categoryKeys.map((k) => {
          const c = wordCategories[k];
          const active = k === category;
          return (
            <button
              key={k}
              onClick={() => { setCategory(k); setLevelIdx(0); sfx.click(muted); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                active ? "bg-aurora text-primary-foreground shadow-lg" : "glass hover:scale-105"
              }`}
            >
              <span className="mr-1.5">{c.emoji}</span>{c.label}
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
              className={`w-10 h-10 rounded-xl text-sm font-bold transition relative
                ${active ? "bg-aurora text-primary-foreground shadow-lg scale-105" : ""}
                ${unlocked && !active ? "glass hover:scale-105" : ""}
                ${!unlocked ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed" : ""}`}
              title={unlocked ? `Level ${i + 1}` : `Unlock at ${UNLOCK_THRESHOLDS[i]} pts`}
            >
              {unlocked ? i + 1 : <Lock className="w-3.5 h-3.5 mx-auto" />}
            </button>
          );
        })}
      </div>

      {/* puzzle card */}
      <div className="mt-8 glass-3d rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{cat.label} · Level {levelIdx + 1}/{totalLevels}</div>
            <div className="text-lg font-semibold flex items-center gap-2 mt-1">
              <Lightbulb className="w-5 h-5 text-accent" /> Hint
            </div>
          </div>
          <button
            onClick={() => speak(puzzle.hint, muted)}
            className="glass rounded-full px-3 py-2 text-xs flex items-center gap-1 hover:scale-105 transition"
          >
            <Volume2 className="w-3.5 h-3.5" /> Read aloud
          </button>
        </div>

        <p className="mt-3 text-2xl md:text-3xl font-display leading-snug">
          “{puzzle.hint}”
        </p>

        {/* letter reveal */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {puzzle.answer.split("").map((_, i) => (
            <div
              key={i}
              className={`w-10 h-12 md:w-12 md:h-14 rounded-xl glass grid place-items-center text-xl md:text-2xl font-bold ${
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
            <div className="text-xl">🎉 Nailed it!</div>
            <div className="text-sm text-muted-foreground">The word was <b className="uppercase">{puzzle.answer}</b>.</div>
            <div className="mt-3 flex justify-center gap-2">
              {levelIdx + 1 < totalLevels && isLevelUnlocked(levelIdx + 1) && (
                <button onClick={() => { setLevelIdx(levelIdx + 1); sfx.click(muted); }}
                  className="px-4 py-2 rounded-xl bg-aurora text-primary-foreground text-sm font-semibold">
                  Next puzzle →
                </button>
              )}
              <button onClick={() => { setLevelIdx(levelIdx); /* no-op */ }} className="hidden" />
            </div>
          </div>
        )}
        {status === "lost" && (
          <div className="mt-6 glass rounded-2xl p-4 text-center animate-shake">
            <div className="text-xl">💔 No more tries</div>
            <div className="text-sm text-muted-foreground">The answer was <b className="uppercase">{puzzle.answer}</b>.</div>
            <button onClick={() => { setStatus("playing"); setAttempts(3); setRevealed(new Array(puzzle.answer.length).fill("")); sfx.click(muted); }}
              className="mt-3 px-4 py-2 rounded-xl bg-aurora text-primary-foreground text-sm font-semibold inline-flex items-center gap-1">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
