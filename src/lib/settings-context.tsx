import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
interface Settings {
  muted: boolean;
  theme: Theme;
  toggleMute: () => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const m = localStorage.getItem("muted");
    const t = localStorage.getItem("theme") as Theme | null;
    if (m) setMuted(m === "1");
    if (t) setTheme(t);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("muted", muted ? "1" : "0");
  }, [muted]);

  return (
    <SettingsContext.Provider
      value={{
        muted,
        theme,
        toggleMute: () => setMuted((v) => !v),
        toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
