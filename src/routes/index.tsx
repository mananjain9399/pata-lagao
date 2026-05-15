import { createFileRoute, Link } from "@tanstack/react-router";
import { Hash, MessageCircleQuestion, Music2, Trophy, Zap, Volume2, Layers } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { sfx } from "@/lib/sound";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PataLagao — Number, Word & Emoji Song guessing games" },
      { name: "description", content: "Three calm guessing games — secret numbers, themed word hunts, and emoji songs. Hindi + English, daily challenges, streaks, and a global leaderboard." },
    ],
  }),
  component: Home,
});

function Home() {
  const { muted } = useSettings();

  return (
    <div className="max-w-6xl mx-auto px-4 pt-12 pb-20">
      <section className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground">
          <Zap className="w-3 h-3 text-accent" /> 🎮 Daily challenges · Hindi + English · Voice prompts ✨
        </span>
        <h1 className="mt-5 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tighter">
          🕹️ Pata <span className="text-aurora">Lagao</span> 👾<br />
          Chill karo, soch ke khelo.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Teen mazedaar games 🎲 — secret number, themed sentence ya emoji ke songs. Hindi hints, daily streaks 🔥 aur global leaderboard 🏆.
        </p>
      </section>

      {/* compact 3-game launcher */}
      <section className="mt-12 grid sm:grid-cols-3 gap-4">
        <GameButton
          to="/number-game"
          theme="theme-number"
          logo="🔢"
          icon={<Hash className="w-4 h-4" />}
          title="Number Guess"
          tag="10 levels · ranges"
          onClick={() => sfx.click(muted)}
        />
        <GameButton
          to="/word-game"
          theme="theme-word"
          logo="💬"
          icon={<MessageCircleQuestion className="w-4 h-4" />}
          title="Word Hunt"
          tag="Sentence → 1 word"
          onClick={() => sfx.click(muted)}
        />
        <GameButton
          to="/song-game"
          theme="theme-song"
          logo="🎵"
          icon={<Music2 className="w-4 h-4" />}
          title="Emoji Songs"
          tag="Hindi · English · Punjabi"
          onClick={() => sfx.click(muted)}
        />
      </section>

      <section className="mt-12 grid sm:grid-cols-3 gap-4">
        <Feature icon={<Layers className="w-5 h-5" />} title="🔥 Daily challenges" desc="A new puzzle every day. Build a streak — it gets harder as you get better!" />
        <Feature icon={<Volume2 className="w-5 h-5" />} title="🎤 Girl voice prompts" desc="A friendly voice reads every puzzle. Tap mute anytime." />
        <Feature icon={<Trophy className="w-5 h-5" />} title="🏆 Global leaderboard" desc="Sign in to save scores and climb the world ranks." />
      </section>
    </div>
  );
}

function GameButton({
  to, theme, logo, icon, title, tag, onClick,
}: {
  to: string; theme: string; logo: string; icon: React.ReactNode;
  title: string; tag: string; onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${theme} group relative glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all`}
    >
      <div className="w-12 h-12 rounded-xl bg-aurora grid place-items-center text-2xl shadow-md group-hover:scale-110 transition shrink-0">
        <span aria-hidden>{logo}</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
          {icon} <span>Play</span>
        </div>
        <div className="font-semibold tracking-tight">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{tag}</div>
      </div>
      <div className="ml-auto text-aurora font-semibold text-sm">→</div>
    </Link>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="w-9 h-9 rounded-xl bg-aurora grid place-items-center text-primary-foreground">{icon}</div>
      <h4 className="mt-3 font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
