import { createFileRoute, Link } from "@tanstack/react-router";
import { Hash, MessageCircleQuestion, Trophy, Zap, Volume2, Layers } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { sfx } from "@/lib/sound";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PataLagao — Calm guessing games with Hindi hints" },
      { name: "description", content: "Pick the Number game or the Word game. Daily challenges, streaks, Hindi + English hints, and a global leaderboard." },
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
          <Zap className="w-3 h-3 text-accent" /> Daily challenges · Hindi + English · Voice prompts
        </span>
        <h1 className="mt-5 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tighter">
          Pata <span className="text-aurora">Lagao</span>. <br />
          Slow down, soch ke khelo.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Do mazedaar games — secret number dhoondo ya themed sentence ka one-word jawab dho. Hindi
          translations, daily challenges, streaks aur ek global leaderboard. Bachchon ke liye perfect!
        </p>
      </section>

      <section className="mt-14 grid md:grid-cols-2 gap-6">
        <GameCard
          to="/number-game"
          title="Number Guess"
          subtitle="Crack the secret number"
          desc="10 progressive levels. Tighter ranges, fewer attempts, bigger points."
          icon={<Hash className="w-7 h-7" />}
          accent="from-violet-500 to-fuchsia-500"
          onClick={() => sfx.click(muted)}
        />
        <GameCard
          to="/word-game"
          title="Word Hunt"
          subtitle="One sentence, one-word answer"
          desc="Pick General Knowledge, Cars, Cartoons or Movies. Hindi hints + daily streak!"
          icon={<MessageCircleQuestion className="w-7 h-7" />}
          accent="from-pink-400 to-orange-400"
          onClick={() => sfx.click(muted)}
        />
      </section>

      <section className="mt-14 grid sm:grid-cols-3 gap-4">
        <Feature icon={<Layers className="w-5 h-5" />} title="Daily challenges" desc="A new puzzle every day. Build a streak — it gets harder as you get better!" />
        <Feature icon={<Volume2 className="w-5 h-5" />} title="Girl voice prompts" desc="A friendly voice reads every puzzle. Tap mute anytime." />
        <Feature icon={<Trophy className="w-5 h-5" />} title="Global leaderboard" desc="Sign in to save scores and climb the world ranks." />
      </section>
    </div>
  );
}

function GameCard({
  to, title, subtitle, desc, icon, accent, onClick,
}: {
  to: string; title: string; subtitle: string; desc: string;
  icon: React.ReactNode; accent: string; onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group relative glass-3d rounded-3xl p-8 overflow-hidden hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-40 bg-gradient-to-br ${accent} group-hover:opacity-60 transition`} />
      <div className="relative">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} grid place-items-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition`}>
          {icon}
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <p className="mt-3 text-sm text-foreground/80">{desc}</p>
        <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-aurora">
          Play now →
        </div>
      </div>
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
