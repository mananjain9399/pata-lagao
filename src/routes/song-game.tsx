import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Music2, RotateCcw, Lightbulb, Volume2, Trophy, Shuffle } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { sfx, speak, stopSpeak } from "@/lib/sound";
import { Confetti } from "@/components/Confetti";
import { getSongsByLanguage, songLanguages, type SongLanguage, type SongPuzzle } from "@/lib/song-data";
import { toast } from "sonner";

export const Route = createFileRoute("/song-game")({
  head: () => ({
    meta: [
      { title: "Emoji Song Quiz — PataLagao" },
      { name: "description", content: "Guess the song from emojis. Hindi, English & Punjabi categories." },
    ],
  }),
  component: SongGame,
});

const STORAGE_KEY = "song-game-progress";
interface Progress { points: number; solved: number }
function load(): Progress {
  if (typeof window === "undefined") return { points: 0, solved: 0 };
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "") || { points: 0, solved: 0 }; }
  catch { return { points: 0, solved: 0 }; }
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function pickRandom<T>(arr: T[], avoid?: T): T {
  if (arr.length <= 1) return arr[0];
  let p = arr[Math.floor(Math.random() * arr.length)];
  let safety = 0;
  while (avoid && p === avoid && safety < 8) {
    p = arr[Math.floor(Math.random() * arr.length)];
    safety++;
  }
  return p;
}

const langMeta: Record<SongLanguage, { label: string; emoji: string }> = {
  hindi: { label: "Hindi", emoji: "🇮🇳" },
  english: { label: "English", emoji: "🇬🇧" },
  punjabi: { label: "Punjabi", emoji: "🪯" },
};

function SongGame() {
  const { muted } = useSettings();
  const [progress, setProgress] = useState<Progress>({ points: 0, solved: 0 });
  const [language, setLanguage] = useState<SongLanguage>("hindi");
  const [puzzle, setPuzzle] = useState<SongPuzzle | null>(null);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(3);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [showHint, setShowHint] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const pool = useMemo(() => getSongsByLanguage(language), [language]);

  useEffect(() => { setProgress(load()); }, []);

  const newRound = (avoid?: SongPuzzle | null) => {
    const next = pickRandom(pool, avoid ?? undefined);
    setPuzzle(next);
    setGuess("");
    setAttempts(3);
    setShowHint(false);
    setStatus("playing");
    sfx.click(muted);
  };

  // start round when language changes
  useEffect(() => {
    const next = pickRandom(pool);
    setPuzzle(next);
    setGuess("");
    setAttempts(3);
    setShowHint(false);
    setStatus("playing");
    return () => stopSpeak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  if (!puzzle) return null;

  const isMatch = (g: string) => {
    const n = norm(g);
    if (n === norm(puzzle.answer)) return true;
    return (puzzle.aliases ?? []).some((a) => norm(a) === n);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "playing") return;
    if (!guess.trim()) return;
    if (isMatch(guess)) {
      const earned = 20 + attempts * 8;
      const next = { points: progress.points + earned, solved: progress.solved + 1 };
      setProgress(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStatus("won");
      setCelebrate(true);
      sfx.win(muted);
      speak(`Correct! The song is ${puzzle.answer}. You earned ${earned} points.`, muted);
      setTimeout(() => setCelebrate(false), 3000);
      return;
    }
    const left = attempts - 1;
    setAttempts(left);
    sfx.wrong(muted);
    if (left <= 0) {
      setStatus("lost");
      speak(`Out of tries. The song was ${puzzle.answer}.`, muted);
    } else {
      toast(`Try again — ${left} ${left === 1 ? "try" : "tries"} left`);
    }
    setGuess("");
  };

  const useHint = () => {
    if (showHint) return;
    setShowHint(true);
    sfx.click(muted);
    speak(`Hint: ${puzzle.hint}`, muted);
  };

  return (
    <div className="theme-song max-w-4xl mx-auto px-4 pt-8 pb-20">
      <Confetti show={celebrate} />

      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Emoji <span className="text-aurora">Song Quiz</span>
          </h1>
          <p className="text-muted-foreground">Emojis dekho, gaana pehchaano 🎶</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-2xl px-4 py-2 text-sm">
            <span className="text-muted-foreground">Solved</span>
            <span className="ml-2 font-bold text-aurora">{progress.solved}</span>
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

      {/* language tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {songLanguages.map((l) => {
          const active = l === language;
          return (
            <button
              key={l}
              onClick={() => { setLanguage(l); sfx.click(muted); }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                active ? "bg-aurora text-primary-foreground shadow-lg" : "glass hover:scale-105"
              }`}
            >
              <span className="mr-1.5 text-base">{langMeta[l].emoji}</span>{langMeta[l].label}
            </button>
          );
        })}
      </div>

      {/* puzzle card */}
      <div className="mt-8 glass-3d rounded-3xl p-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Music2 className="w-4 h-4" /> {langMeta[language].label} song
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => newRound(puzzle)}
              className="glass rounded-full px-3 py-2 text-xs flex items-center gap-1 hover:scale-105 transition"
            >
              <Shuffle className="w-3.5 h-3.5" /> New song
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

        <div className="mt-6 text-center">
          <div className="text-6xl md:text-7xl tracking-widest leading-none select-none">
            {puzzle.emojis}
          </div>
          {puzzle.artist && status !== "playing" && (
            <div className="mt-3 text-sm text-muted-foreground">by <b>{puzzle.artist}</b></div>
          )}
        </div>

        {showHint && (
          <div className="mt-6 glass rounded-2xl p-4 text-sm flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold">Hint</div>
              <div className="text-muted-foreground">{puzzle.hint}</div>
            </div>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 flex gap-2 max-w-md mx-auto">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={status !== "playing"}
            autoFocus
            placeholder="Guess the song name..."
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
          Tries left: <span className="font-bold text-foreground">{attempts}</span>
        </div>

        {status === "won" && (
          <div className="mt-6 glass rounded-2xl p-4 text-center animate-pop">
            <div className="text-xl">🎉 Sahi pehchaana!</div>
            <div className="text-sm text-muted-foreground">The song was <b className="capitalize">{puzzle.answer}</b>{puzzle.artist ? ` by ${puzzle.artist}` : ""}.</div>
            <button onClick={() => newRound(puzzle)}
              className="mt-3 px-4 py-2 rounded-2xl bg-aurora text-primary-foreground text-sm font-semibold inline-flex items-center gap-1">
              <Shuffle className="w-4 h-4" /> Next song →
            </button>
          </div>
        )}
        {status === "lost" && (
          <div className="mt-6 glass rounded-2xl p-4 text-center animate-shake">
            <div className="text-xl">💔 Better luck next time!</div>
            <div className="text-sm text-muted-foreground">The song was <b className="capitalize">{puzzle.answer}</b>{puzzle.artist ? ` by ${puzzle.artist}` : ""}.</div>
            <button onClick={() => newRound(puzzle)}
              className="mt-3 px-4 py-2 rounded-2xl bg-aurora text-primary-foreground text-sm font-semibold inline-flex items-center gap-1">
              <RotateCcw className="w-4 h-4" /> Try another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
