// Web Audio SFX + browser TTS with female voice preference.
let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = (window.AudioContext || (window as any).webkitAudioContext) as
      | typeof AudioContext | undefined;
    if (!C) return null;
    ctx = new C();
  }
  return ctx;
}

function tone(muted: boolean, freq: number, duration = 0.18, type: OscillatorType = "sine", gain = 0.15, attack = 0.01) {
  if (muted) return;
  const a = ac(); if (!a) return;
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
  click: (m: boolean) => tone(m, 720, 0.07, "triangle", 0.08),
  high: (m: boolean) => tone(m, 980, 0.15, "sine", 0.12),
  low: (m: boolean) => tone(m, 280, 0.18, "sawtooth", 0.1),
  wrong: (m: boolean) => {
    tone(m, 240, 0.18, "square", 0.12);
    setTimeout(() => tone(m, 160, 0.22, "square", 0.12), 120);
  },
  win: (m: boolean) => {
    if (m) return;
    [659, 784, 988, 1318].forEach((n, i) =>
      setTimeout(() => tone(m, n, 0.22, "triangle", 0.18, 0.005), i * 110));
  },
  unlock: (m: boolean) => {
    if (m) return;
    [523, 659, 784, 1046].forEach((n, i) =>
      setTimeout(() => tone(m, n, 0.18, "sine", 0.15), i * 80));
  },
};

// Pick a female voice once available
let femaleVoice: SpeechSynthesisVoice | null = null;
function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (femaleVoice) return femaleVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const femaleHints = /female|woman|girl|samantha|victoria|karen|tessa|fiona|moira|susan|allison|ava|zira|google uk english female|google us english|amelia|sara|lucia|priya|veena|raveena|kalpana/i;
  const byName = voices.find((v) => femaleHints.test(v.name));
  if (byName) return (femaleVoice = byName);
  // fall back to any en/hi voice
  const en = voices.find((v) => /^en/i.test(v.lang));
  return (femaleVoice = en ?? voices[0]);
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => { femaleVoice = null; pickFemaleVoice(); };
}

export function speak(text: string, muted: boolean, opts?: { rate?: number; pitch?: number }) {
  if (muted) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickFemaleVoice();
    if (v) u.voice = v;
    u.rate = opts?.rate ?? 1;
    u.pitch = opts?.pitch ?? 1.4; // higher = girlier
    u.volume = 0.95;
    window.speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

export function stopSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch { /* */ }
  }
}
