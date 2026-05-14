import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Volume2, VolumeX, Trophy, Sparkles, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { sfx } from "@/lib/sound";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { muted, theme, toggleMute, toggleTheme } = useSettings();
  const { user } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const navLink = (to: string, label: ReactNode) => {
    const active = path === to;
    return (
      <Link
        to={to}
        onClick={() => sfx.click(muted)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
          active
            ? "bg-aurora text-primary-foreground shadow-lg"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* floating blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full opacity-30 animate-blob"
             style={{ background: "radial-gradient(circle, oklch(0.78 0.17 285), transparent 70%)" }} />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-25 animate-blob"
             style={{ background: "radial-gradient(circle, oklch(0.78 0.18 175), transparent 70%)", animationDelay: "-6s" }} />
        <div className="absolute -bottom-40 left-1/4 w-[450px] h-[450px] rounded-full opacity-20 animate-blob"
             style={{ background: "radial-gradient(circle, oklch(0.85 0.18 145), transparent 70%)", animationDelay: "-12s" }} />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/40 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" onClick={() => sfx.click(muted)} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-aurora grid place-items-center shadow-lg group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Pata<span className="text-aurora">Lagao</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLink("/", "Home")}
            {navLink("/number-game", "Number")}
            {navLink("/word-game", "Word")}
            {navLink("/leaderboard", "Leaderboard")}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { toggleMute(); sfx.click(false); }}
              aria-label={muted ? "Unmute" : "Mute"}
              className="w-9 h-9 rounded-full glass grid place-items-center hover:scale-110 transition"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { toggleTheme(); sfx.click(muted); }}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full glass grid place-items-center hover:scale-110 transition"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <button
                onClick={async () => { await supabase.auth.signOut(); }}
                className="hidden sm:flex h-9 px-3 rounded-full glass items-center gap-2 text-sm hover:scale-105 transition"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => sfx.click(muted)}
                className="hidden sm:flex h-9 px-3 rounded-full bg-aurora items-center gap-2 text-sm font-semibold text-primary-foreground hover:scale-105 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
        {/* mobile nav */}
        <div className="md:hidden flex items-center justify-center gap-1 pb-3 px-4">
          {navLink("/", "Home")}
          {navLink("/number-game", "Number")}
          {navLink("/word-game", "Word")}
          {navLink("/leaderboard", <Trophy className="w-4 h-4" />)}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="text-center text-xs text-muted-foreground py-6">
        Made with 💜 · <span className="text-aurora">PataLagao</span>
      </footer>
    </div>
  );
}
