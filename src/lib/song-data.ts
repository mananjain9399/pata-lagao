export interface SongPuzzle {
  emojis: string;
  // Optional breakdown — shows what each emoji stands for (without giving away the answer).
  // Rendered as small chips so the user can "read" the rebus.
  breakdown?: string[];
  answer: string;
  aliases?: string[];
  hint: string;
  artist?: string;
  language: "hindi" | "english" | "punjabi";
}

// Each puzzle: emojis literally spell out one or more words of the song title.
// Read the breakdown to understand the mapping.
const songs: SongPuzzle[] = [
  // ── HINDI ─────────────────────────────────────────────────────────────
  { emojis: "☕ ☕",       breakdown: ["☕ = chai (tea)", "repeated twice"], answer: "chaiyya chaiyya", hint: "SRK dancing on top of a moving train (Dil Se)", artist: "Sukhwinder Singh", language: "hindi" },
  { emojis: "🌙 + 💖",     breakdown: ["🌙 = chand/channa (moon)", "💖 = mereya (mine/love)"], answer: "channa mereya", hint: "Heartbreak song from Ae Dil Hai Mushkil", artist: "Arijit Singh", language: "hindi" },
  { emojis: "📅 ➡️ ❓",    breakdown: ["📅 = kal (tomorrow)", "➡️❓ = ho na ho (may or may not be)"], answer: "kal ho naa ho", aliases: ["kal ho na ho"], hint: "Title track of the SRK film", artist: "Sonu Nigam", language: "hindi" },
  { emojis: "🔴 🎨",       breakdown: ["🔴🎨 = gerua (a reddish-saffron colour)"], answer: "gerua", hint: "Dilwale — SRK & Kajol on a Goa beach", artist: "Arijit Singh", language: "hindi" },
  { emojis: "🌧️ ➕ 💃",   breakdown: ["🌧️ = baarish (rain)", "💃 = dance"], answer: "baarish", hint: "Half Girlfriend romantic rain song", artist: "Ash King", language: "hindi" },
  { emojis: "💔 ➕ 🎶",    breakdown: ["💔 = broken heart", "🎶 = song"], answer: "channa ve", hint: "Bhoot — sad love melody", artist: "Akhil Sachdeva", language: "hindi" },
  { emojis: "🌌 ➕ 🤩",    breakdown: ["🌌 = galaxy / stars", "🤩 = wow/jhalak (glimpse)"], answer: "jhalak dikhla ja", hint: "Aksar — Himesh Reshammiya cap song", artist: "Himesh Reshammiya", language: "hindi" },
  { emojis: "👩 + 🔥",     breakdown: ["👩 = sheila/girl", "🔥 = jawani (youth)"], answer: "sheila ki jawani", hint: "Katrina Kaif item number in Tees Maar Khan", artist: "Sunidhi Chauhan", language: "hindi" },
  { emojis: "👩 👎 📛",    breakdown: ["👩 = munni (girl)", "👎 = badnaam (defamed)", "📛 = name"], answer: "munni badnaam hui", hint: "Dabangg Malaika Arora item song", artist: "Mamta Sharma", language: "hindi" },
  { emojis: "🚗 🛣️ 🙏",    breakdown: ["🚗🛣️ = road trip", "🙏 = ilahi (god)"], answer: "ilahi", hint: "Yeh Jawaani Hai Deewani travel song", artist: "Arijit Singh", language: "hindi" },
  { emojis: "🥁 ⚔️ 🐅",    breakdown: ["🥁 = battle drums", "⚔️🐅 = warrior/Maratha"], answer: "malhari", hint: "Bajirao Mastani — Ranveer's victory dance", artist: "Vishal Dadlani", language: "hindi" },
  { emojis: "🙏 ☀️ 🎓",    breakdown: ["🙏 = give me", "☀️ = sunshine", "🎓 = student life"], answer: "give me some sunshine", hint: "3 Idiots emotional anthem", artist: "Sharman Joshi & Suraj Jagan", language: "hindi" },
  { emojis: "👁️ ➕ 👁️",   breakdown: ["👁️👁️ = aankh (eyes)", "marey (hit)"], answer: "aankh marey", hint: "Simmba reboot of a 90s Ranveer dance hit", artist: "Mika Singh & Neha Kakkar", language: "hindi" },
  { emojis: "❄️ ➕ 🏔️",   breakdown: ["❄️🏔️ = ice / cold mountain"], answer: "jab tak hai jaan", hint: "SRK-Katrina title song — 'as long as I live'", artist: "Javed Ali", language: "hindi" },
  { emojis: "👀 ➕ 👀",    breakdown: ["👀👀 = nazar (eyes/gaze)", "implied 'lagi'"], answer: "nazar lag jayegi", hint: "Millind Gaba — flirty pop hit", artist: "Millind Gaba", language: "hindi" },

  // ── ENGLISH ───────────────────────────────────────────────────────────
  { emojis: "☂️",                breakdown: ["☂️ = umbrella"], answer: "umbrella", hint: "Rihanna — 'ella ella eh eh eh'", artist: "Rihanna", language: "english" },
  { emojis: "🎆",                breakdown: ["🎆 = firework"], answer: "firework", hint: "Katy Perry — 'baby you're a...'", artist: "Katy Perry", language: "english" },
  { emojis: "⭕ + 👉",           breakdown: ["⭕ = shape", "👉 = you"], answer: "shape of you", hint: "Ed Sheeran — Divide album single", artist: "Ed Sheeran", language: "english" },
  { emojis: "👁️ + 🐯",          breakdown: ["👁️ = eye", "🐯 = tiger"], answer: "eye of the tiger", hint: "Rocky III training anthem", artist: "Survivor", language: "english" },
  { emojis: "💜 + 🌧️",          breakdown: ["💜 = purple", "🌧️ = rain"], answer: "purple rain", hint: "Prince's iconic 1984 ballad", artist: "Prince", language: "english" },
  { emojis: "🚀 + 🧑",           breakdown: ["🚀 = rocket", "🧑 = man"], answer: "rocket man", hint: "Elton John astronaut classic", artist: "Elton John", language: "english" },
  { emojis: "👋",                breakdown: ["👋 = hello / greeting"], answer: "hello", hint: "Adele — 'it's me, I was wondering...'", artist: "Adele", language: "english" },
  { emojis: "🎲 + 🌊",           breakdown: ["🎲 = rolling", "🌊 = deep water"], answer: "rolling in the deep", hint: "Adele's 2010 mega-hit", artist: "Adele", language: "english" },
  { emojis: "⬜ + 🌌",           breakdown: ["⬜ = blank", "🌌 = space"], answer: "blank space", hint: "Taylor Swift 1989 album hit", artist: "Taylor Swift", language: "english" },
  { emojis: "👎 + 👤",           breakdown: ["👎 = bad", "👤 = guy"], answer: "bad guy", hint: "Billie Eilish — 'duh' song", artist: "Billie Eilish", language: "english" },
  { emojis: "😀",                breakdown: ["😀 = happy face"], answer: "happy", hint: "Pharrell — 'clap along if you feel...'", artist: "Pharrell Williams", language: "english" },
  { emojis: "🤠 + 🏘️ + 🛣️",     breakdown: ["🤠 = old western (old)", "🏘️ = town", "🛣️ = road"], answer: "old town road", hint: "Lil Nas X country-rap viral smash", artist: "Lil Nas X", language: "english" },
  { emojis: "🔔 🔔",             breakdown: ["🔔🔔 = jingle bells"], answer: "jingle bells", hint: "Most famous Christmas carol", artist: "Traditional", language: "english" },
  { emojis: "👶 + 🦈",           breakdown: ["👶 = baby", "🦈 = shark"], answer: "baby shark", hint: "Viral kids' song — 'doo doo doo doo'", artist: "Pinkfong", language: "english" },
  { emojis: "🤔 + ☁️ + 🔊",      breakdown: ["🤔 = thinking", "☁️ = out (in the air)", "🔊 = loud"], answer: "thinking out loud", hint: "Ed Sheeran wedding-favourite ballad", artist: "Ed Sheeran", language: "english" },

  // ── PUNJABI ───────────────────────────────────────────────────────────
  { emojis: "🚜",                breakdown: ["🚜 = tractor"], answer: "tractor", aliases: ["288"], hint: "Diljit Dosanjh '288' farm-vehicle song", artist: "Diljit Dosanjh", language: "punjabi" },
  { emojis: "👰 + 👗",           breakdown: ["👰 = bride", "👗 = lehanga (skirt)"], answer: "lehanga", aliases: ["lehnga"], hint: "Jass Manak wedding-dress romantic hit", artist: "Jass Manak", language: "punjabi" },
  { emojis: "🟤 + 👬",           breakdown: ["🟤 = brown", "👬 = munde (boys)"], answer: "brown munde", hint: "AP Dhillon anthem for desi boys abroad", artist: "AP Dhillon", language: "punjabi" },
  { emojis: "2️⃣ 9️⃣ 5️⃣",        breakdown: ["digits: 2, 9, 5"], answer: "295", hint: "Sidhu Moose Wala song named after an IPC section", artist: "Sidhu Moose Wala", language: "punjabi" },
  { emojis: "🍀",                breakdown: ["🍀 = luck / qismat"], answer: "qismat", hint: "Ammy Virk film title song about destiny", artist: "Ammy Virk", language: "punjabi" },
  { emojis: "👗 + 🌶️",           breakdown: ["👗 = pretty girl", "🌶️ = hot — patola"], answer: "patola", hint: "Guru Randhawa — means 'beautiful girl'", artist: "Guru Randhawa", language: "punjabi" },
  { emojis: "⬆️ ☁️",             breakdown: ["⬆️ = so high", "☁️ = above the clouds"], answer: "so high", hint: "Sidhu Moose Wala 2017 debut hit", artist: "Sidhu Moose Wala", language: "punjabi" },
  { emojis: "🇬 + 🚙",            breakdown: ["🇬 = letter G", "🚙 = wagon (SUV)"], answer: "g wagon", aliases: ["gwagon"], hint: "Sidhu Moose Wala — about a Mercedes SUV", artist: "Sidhu Moose Wala", language: "punjabi" },
  { emojis: "🏎️ + 💨",           breakdown: ["🏎️ = Lamborghini-style supercar"], answer: "laembadgini", hint: "Diljit Dosanjh pun on a supercar name", artist: "Diljit Dosanjh", language: "punjabi" },
  { emojis: "👔 👔",             breakdown: ["👔👔 = suit (repeated)"], answer: "suit suit", hint: "Guru Randhawa Punjabi-Bollywood crossover", artist: "Guru Randhawa", language: "punjabi" },
  { emojis: "1️⃣ + 💍🚫",         breakdown: ["1️⃣ = single", "💍🚫 = no ring (unmarried)"], answer: "shadaa", hint: "Diljit Dosanjh — about staying single", artist: "Diljit Dosanjh", language: "punjabi" },
  { emojis: "🥤 🥤",             breakdown: ["🥤🥤 = sip, sip"], answer: "sip sip", hint: "Garry Sandhu 2018 Punjabi club hit", artist: "Garry Sandhu", language: "punjabi" },
  { emojis: "👶 + ✨",           breakdown: ["👶 = born", "✨ = to shine"], answer: "born to shine", hint: "Diljit Dosanjh — Moonchild Era", artist: "Diljit Dosanjh", language: "punjabi" },
  { emojis: "❤️ + 🧑",           breakdown: ["❤️🧑 = lover"], answer: "lover", hint: "Diljit Dosanjh — Moonchild Era romantic", artist: "Diljit Dosanjh", language: "punjabi" },
  { emojis: "🥃 + 🎉",           breakdown: ["🥃 = daru (alcohol)", "🎉 = badnaam (party/famous)"], answer: "daru badnaam", hint: "Punjabi party anthem — Kamal Kahlon", artist: "Kamal Kahlon & Param Singh", language: "punjabi" },
];

export const songLanguages = ["hindi", "english", "punjabi"] as const;
export type SongLanguage = typeof songLanguages[number];

export function getSongsByLanguage(lang: SongLanguage): SongPuzzle[] {
  return songs.filter((s) => s.language === lang);
}

export const allSongs = songs;
