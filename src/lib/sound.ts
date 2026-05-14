// Simple Web Audio sound effects + browser TTS voice prompts.
// All functions are no-ops if muted=true.

let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = (window.AudioContext || (window as any).webkitAudioContext) as
      | typeof AudioContext
      | undefined;
    if (!C) return null;
    ctx = new C();
  }
  return ctx;
}

function tone(
  muted: boolean,
  freq: number,
  duration = 0.18,
  type: OscillatorType = "sine",
  gain = 0.15,
  attack = 0.01,
) {
  if (muted) return;
  const a = ac();
  if (!a) return;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, a.currentTime);
  g.gain.linearRampToValueAtTime(gain, a.currentTime + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + duration);
  osc.connect(g).connect(a.destination);
  osc.start();
  osc.stop(a.currentTime + duration + 0.02);
}

export const sfx = {
  click: (m: boolean) => tone(m, 520, 0.08, "triangle", 0.08),
  high: (m: boolean) => tone(m, 880, 0.15, "sine", 0.12),
  low: (m: boolean) => tone(m, 220, 0.18, "sawtooth", 0.1),
  wrong: (m: boolean) => {
    tone(m, 200, 0.18, "square", 0.12);
    setTimeout(() => tone(m, 140, 0.22, "square", 0.12), 120);
  },
  win: (m: boolean) => {
    if (m) return;
    const notes = [523, 659, 784, 1046];
    notes.forEach((n, i) =>
      setTimeout(() => tone(m, n, 0.22, "triangle", 0.18, 0.005), i * 110),
    );
  },
  unlock: (m: boolean) => {
    if (m) return;
    [392, 523, 659, 784].forEach((n, i) =>
      setTimeout(() => tone(m, n, 0.18, "sine", 0.15), i * 80),
    );
  },
};

export function speak(text: string, muted: boolean, opts?: { rate?: number; pitch?: number }) {
  if (muted) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts?.rate ?? 1;
    u.pitch = opts?.pitch ?? 1;
    u.volume = 0.9;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function stopSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch { /* */ }
  }
}
