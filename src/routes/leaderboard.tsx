import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchLeaderboard, type LeaderRow } from "@/lib/leaderboard";
import { Trophy, Medal, Hash, MessageCircleQuestion } from "lucide-react";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — GuessVerse" }] }),
  component: Leaderboard,
});

function Leaderboard() {
  const [game, setGame] = useState<"number" | "word">("number");
  const [rows, setRows] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard(game).then((r) => { setRows(r); setLoading(false); });
  }, [game]);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-20">
      <div className="text-center">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-aurora items-center justify-center text-primary-foreground shadow-xl mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Global <span className="text-aurora">Leaderboard</span></h1>
        <p className="text-muted-foreground mt-2">Top guessers across the world.</p>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => setGame("number")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition ${
            game === "number" ? "bg-aurora text-primary-foreground shadow-lg" : "glass hover:scale-105"
          }`}
        >
          <Hash className="w-4 h-4" /> Number Guess
        </button>
        <button
          onClick={() => setGame("word")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition ${
            game === "word" ? "bg-aurora text-primary-foreground shadow-lg" : "glass hover:scale-105"
          }`}
        >
          <MessageCircleQuestion className="w-4 h-4" /> Word Hunt
        </button>
      </div>

      {!user && (
        <div className="mt-6 glass rounded-2xl p-4 text-center text-sm">
          <Link to="/auth" className="text-aurora font-semibold hover:underline">Sign in</Link>
          <span className="text-muted-foreground"> to see your name on the board.</span>
        </div>
      )}

      <div className="mt-6 glass-3d rounded-3xl p-4">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No scores yet. Be the first to play!
          </div>
        ) : (
          <ol className="divide-y divide-border">
            {rows.map((r, i) => {
              const rank = i + 1;
              const isMe = user?.id === r.user_id;
              return (
                <li
                  key={r.user_id}
                  className={`flex items-center gap-4 px-4 py-3 ${isMe ? "bg-primary/10 rounded-xl" : ""}`}
                >
                  <div className={`w-9 h-9 rounded-xl grid place-items-center font-bold shadow ${
                    rank === 1 ? "bg-yellow-400/30 text-yellow-300" :
                    rank === 2 ? "bg-gray-300/30 text-gray-200" :
                    rank === 3 ? "bg-orange-400/30 text-orange-300" :
                    "glass text-muted-foreground"
                  }`}>
                    {rank <= 3 ? <Medal className="w-4 h-4" /> : rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {r.display_name}{isMe && <span className="ml-2 text-xs text-aurora">(you)</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Highest level: {r.highest_level}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-aurora">{r.points}</div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
