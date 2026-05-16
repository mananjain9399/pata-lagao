export interface SongPuzzle {
  emojis: string;
  answer: string;
  aliases?: string[];
  hint: string;
  artist?: string;
  language: "hindi" | "english" | "punjabi";
}

// Rebus-style: read the emojis aloud and you hear the song title.
const songs: SongPuzzle[] = [
  // ── HINDI ─────────────────────────────────────────────────────────────
  // "tum hi ho"  → you (👉) + only (1️⃣) + are (🫵)... use literal sounds
  { emojis: "👉🅾️🏠", answer: "tum hi ho", hint: "Aashiqui 2 ka sabse famous romantic song — Arijit Singh", artist: "Arijit Singh", language: "hindi" },
  // "kal ho naa ho" → tomorrow 📅➡️ + no 🚫 + house 🏠
  { emojis: "📅🚫🏠", answer: "kal ho naa ho", aliases: ["kal ho na ho"], hint: "SRK film title track — tomorrow may not come", artist: "Sonu Nigam", language: "hindi" },
  // "chaiyya chaiyya" → tea ☕ ☕ (chai-ya chai-ya)
  { emojis: "☕➕☕", answer: "chaiyya chaiyya", hint: "Train ki chhat pe SRK ka dance — Dil Se", artist: "Sukhwinder Singh", language: "hindi" },
  // "channa mereya" → moon 🌙 + mine 🙋‍♂️ (chand-a + mera)
  { emojis: "🌙➕🙋", answer: "channa mereya", hint: "Ae Dil Hai Mushkil ka heartbreak song — Arijit", artist: "Arijit Singh", language: "hindi" },
  // "gerua" → red colour 🔴 (Dilwale)
  { emojis: "🔴🎨💃", answer: "gerua", hint: "Dilwale ka SRK-Kajol romantic colour song", artist: "Arijit Singh", language: "hindi" },
  // "kabira" → weave 🧵 + saint 🧘 + boat 🛶 (Yeh Jawaani)
  { emojis: "🧵🧘🛶", answer: "kabira", hint: "Yeh Jawaani Hai Deewani — Tochi Raina", artist: "Tochi Raina", language: "hindi" },
  // "tujh mein rab dikhta hai" → you 👉 + inside ➡️ + god 🛐 + see 👁️
  { emojis: "👉➡️🛐👁️", answer: "tujh mein rab dikhta hai", hint: "Rab Ne Bana Di Jodi — SRK Anushka", artist: "Roop Kumar Rathod", language: "hindi" },
  // "chaand sifarish" → moon 🌙 + request ✉️🙏
  { emojis: "🌙✉️🙏", answer: "chand sifarish", aliases: ["chaand sifarish"], hint: "Fanaa — Aamir Khan ka romantic song", artist: "Shaan", language: "hindi" },
  // "sheila ki jawani" → girl 👧 + ka + youth 💃🔥
  { emojis: "👧🔑💃🔥", answer: "sheila ki jawani", hint: "Katrina Kaif item number — Tees Maar Khan", artist: "Sunidhi Chauhan", language: "hindi" },
  // "munni badnaam hui" → girl 👧 + bad 👎 + name 📛
  { emojis: "👧👎📛", answer: "munni badnaam hui", hint: "Dabangg item song — Malaika Arora", artist: "Mamta Sharma", language: "hindi" },
  // "ilahi" → god 🙏✨ (road trip)
  { emojis: "🚗🛣️🙏", answer: "ilahi", hint: "Yeh Jawaani Hai Deewani road song — Arijit", artist: "Arijit Singh", language: "hindi" },
  // "tareefan" → praise 👏✨
  { emojis: "👏👑✨", answer: "tareefan", hint: "Veere Di Wedding party song — Badshah", artist: "Badshah", language: "hindi" },
  // "malhari" → drums 🥁 + war 🐅⚔️
  { emojis: "🥁🐅⚔️", answer: "malhari", hint: "Bajirao Mastani Ranveer victory dance", artist: "Vishal Dadlani", language: "hindi" },
  // "give me some sunshine" — 3 Idiots
  { emojis: "🙏☀️🎓", answer: "give me some sunshine", hint: "3 Idiots emotional anthem about freedom", artist: "Sharman Joshi", language: "hindi" },
  // "agar tum saath ho" → if + you + with
  { emojis: "❓👉🤝🏠", answer: "agar tum saath ho", hint: "Tamasha rain breakup song — Deepika & Ranbir", artist: "Alka Yagnik", language: "hindi" },

  // ── ENGLISH ───────────────────────────────────────────────────────────
  // "let it go" → 🔤L + 🆕(it) + 🟢go light
  { emojis: "✋🌬️❄️", answer: "let it go", hint: "Frozen — Elsa's anthem", artist: "Idina Menzel", language: "english" },
  // "rolling in the deep" → 🎲rolling + 🌊deep
  { emojis: "🎲➡️🌊", answer: "rolling in the deep", hint: "Adele's 2010 mega-hit", artist: "Adele", language: "english" },
  // "shape of you" → ⭕shape + 👉you
  { emojis: "⭕🔤👉", answer: "shape of you", hint: "Ed Sheeran — Divide album single", artist: "Ed Sheeran", language: "english" },
  // "eye of the tiger" → 👁️ + 🐯
  { emojis: "👁️🔤🐯", answer: "eye of the tiger", hint: "Rocky III training song", artist: "Survivor", language: "english" },
  // "hello" → 👋
  { emojis: "👋📞🎤", answer: "hello", hint: "Adele — 'it's me, I was wondering...'", artist: "Adele", language: "english" },
  // "rocket man" → 🚀 + 🧑
  { emojis: "🚀🧑🌌", answer: "rocket man", hint: "Elton John classic about an astronaut", artist: "Elton John", language: "english" },
  // "purple rain" → 💜 + 🌧️
  { emojis: "💜🌧️🎸", answer: "purple rain", hint: "Prince's iconic 1984 ballad", artist: "Prince", language: "english" },
  // "umbrella" → ☂️
  { emojis: "☂️🌧️🎤", answer: "umbrella", hint: "Rihanna 'ella ella eh eh eh'", artist: "Rihanna", language: "english" },
  // "firework" → 🎆
  { emojis: "🎆💥✨", answer: "firework", hint: "Katy Perry — 'baby you're a...'", artist: "Katy Perry", language: "english" },
  // "blank space" → ⬜ + 🌌
  { emojis: "⬜🌌📝", answer: "blank space", hint: "Taylor Swift 1989 album hit", artist: "Taylor Swift", language: "english" },
  // "bad guy" → 👎 + 👤
  { emojis: "👎👤🎤", answer: "bad guy", hint: "Billie Eilish — 'duh' song", artist: "Billie Eilish", language: "english" },
  // "thinking out loud" → 🤔 + 🔊
  { emojis: "🤔💭🔊", answer: "thinking out loud", hint: "Ed Sheeran wedding-favourite ballad", artist: "Ed Sheeran", language: "english" },
  // "happy" → 😀
  { emojis: "😀👏🎵", answer: "happy", hint: "Pharrell Williams — clap along if you feel...", artist: "Pharrell Williams", language: "english" },
  // "old town road" → 🤠 + 🛣️
  { emojis: "🤠🐴🛣️", answer: "old town road", hint: "Lil Nas X country-rap viral hit", artist: "Lil Nas X", language: "english" },
  // "jingle bells" → 🔔🔔
  { emojis: "🔔🔔❄️", answer: "jingle bells", hint: "Most famous Christmas carol", artist: "Traditional", language: "english" },

  // ── PUNJABI ───────────────────────────────────────────────────────────
  // "tractor" → 🚜
  { emojis: "🚜🌾🎤", answer: "tractor", aliases: ["288"], hint: "Diljit Dosanjh '288' farm-vehicle song", artist: "Diljit Dosanjh", language: "punjabi" },
  // "lehanga" → 👰 dress
  { emojis: "👰💃🎶", answer: "lehanga", aliases: ["lehnga"], hint: "Jass Manak wedding-dress romantic hit", artist: "Jass Manak", language: "punjabi" },
  // "brown munde" → 🟤 + 👬
  { emojis: "🟤👬✈️", answer: "brown munde", hint: "AP Dhillon anthem for desi boys abroad", artist: "AP Dhillon", language: "punjabi" },
  // "295" → numbers
  { emojis: "2️⃣9️⃣5️⃣", answer: "295", hint: "Sidhu Moose Wala song named after an IPC section", artist: "Sidhu Moose Wala", language: "punjabi" },
  // "qismat" → fortune 🍀✨
  { emojis: "🍀✨💔", answer: "qismat", hint: "Ammy Virk film title song about destiny", artist: "Ammy Virk", language: "punjabi" },
  // "patola" → beautiful girl 👀💃
  { emojis: "👀💃🌶️", answer: "patola", hint: "Guru Randhawa — means 'beautiful girl'", artist: "Guru Randhawa", language: "punjabi" },
  // "so high" → high ⬆️☁️
  { emojis: "⬆️☁️🐎", answer: "so high", hint: "Sidhu Moose Wala 2017 debut hit", artist: "Sidhu Moose Wala", language: "punjabi" },
  // "g wagon" → letter G + 🚙
  { emojis: "🇬🚙💨", answer: "g wagon", aliases: ["gwagon"], hint: "Sidhu Moose Wala song about a Mercedes SUV", artist: "Sidhu Moose Wala", language: "punjabi" },
  // "laembadgini" → super car 🏎️
  { emojis: "🏎️🤑💨", answer: "laembadgini", hint: "Diljit Dosanjh song that puns on a supercar", artist: "Diljit Dosanjh", language: "punjabi" },
  // "suit suit" → 👔👔
  { emojis: "👔👔👰", answer: "suit suit", hint: "Guru Randhawa Punjabi-Bollywood crossover", artist: "Guru Randhawa", language: "punjabi" },
  // "kya baat ay" → ❓ + 🗣️
  { emojis: "❓🗣️👌", answer: "kya baat ay", hint: "Harrdy Sandhu romantic crossover hit", artist: "Harrdy Sandhu", language: "punjabi" },
  // "shadaa" → single 1️⃣
  { emojis: "1️⃣💍🚫", answer: "shadaa", hint: "Diljit Dosanjh — about staying single", artist: "Diljit Dosanjh", language: "punjabi" },
  // "sip sip" → 🥤🥤
  { emojis: "🥤🥤🎉", answer: "sip sip", hint: "Garry Sandhu 2018 Punjabi club hit", artist: "Garry Sandhu", language: "punjabi" },
  // "born to shine" → 👶+✨
  { emojis: "👶➡️✨", answer: "born to shine", hint: "Diljit Dosanjh from Moonchild Era", artist: "Diljit Dosanjh", language: "punjabi" },
  // "lover" → ❤️🧑
  { emojis: "❤️🧑🎤", answer: "lover", hint: "Diljit Dosanjh / Guru Randhawa-style romantic hit (Diljit's MoonChild)", artist: "Diljit Dosanjh", language: "punjabi" },
];

export const songLanguages = ["hindi", "english", "punjabi"] as const;
export type SongLanguage = typeof songLanguages[number];

export function getSongsByLanguage(lang: SongLanguage): SongPuzzle[] {
  return songs.filter((s) => s.language === lang);
}

export const allSongs = songs;
