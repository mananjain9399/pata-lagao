export interface SongPuzzle {
  emojis: string;
  answer: string;       // canonical title
  aliases?: string[];   // alternate accepted answers
  hint: string;         // multi-word helpful hint (NEVER the title itself)
  artist?: string;
  language: "hindi" | "english" | "punjabi";
}

const songs: SongPuzzle[] = [
  // ── HINDI ───────────────────────────────────────────────
  { emojis: "💛🌈🌟", answer: "kal ho naa ho", aliases: ["kal ho na ho"], hint: "SRK and Saif Ali Khan film, sung by Sonu Nigam, title means 'tomorrow may not come'", artist: "Sonu Nigam", language: "hindi" },
  { emojis: "🐘👫🌸", answer: "kuch kuch hota hai", hint: "Karan Johar's 1998 SRK-Kajol classic, title sung by Udit and Alka", artist: "Udit Narayan", language: "hindi" },
  { emojis: "💃🇮🇳🎶", answer: "chaiyya chaiyya", hint: "Shah Rukh Khan dancing on top of a moving train, by A.R. Rahman", artist: "Sukhwinder Singh", language: "hindi" },
  { emojis: "🌧️❤️🚂", answer: "tujhe dekha to ye jana sanam", aliases: ["tujhe dekha to"], hint: "DDLJ mustard fields scene with SRK and Kajol", artist: "Lata Mangeshkar", language: "hindi" },
  { emojis: "🔥💃🎤", answer: "sheila ki jawani", hint: "Tees Maar Khan item number, Katrina Kaif on screen", artist: "Sunidhi Chauhan", language: "hindi" },
  { emojis: "👶👶👶", answer: "tareefan", hint: "Veere Di Wedding girls' anthem with Badshah", artist: "Badshah", language: "hindi" },
  { emojis: "🌙✨💕", answer: "chand sifarish", hint: "Fanaa romantic song, Aamir Khan and Kajol", artist: "Shaan", language: "hindi" },
  { emojis: "🐦🕊️🎵", answer: "panchhi banu", hint: "Old Lata Mangeshkar classic about flying like a bird", artist: "Lata Mangeshkar", language: "hindi" },
  { emojis: "💔🎻🌧️", answer: "channa mereya", hint: "Ae Dil Hai Mushkil heartbreak anthem by Arijit", artist: "Arijit Singh", language: "hindi" },
  { emojis: "🌟🎤👑", answer: "deewangi deewangi", hint: "Om Shanti Om star-studded party song", artist: "Shaan", language: "hindi" },
  { emojis: "🎓👫📚", answer: "give me some sunshine", hint: "3 Idiots emotional anthem about wanting freedom", artist: "Sharman Joshi", language: "hindi" },
  { emojis: "🚗🛣️🎶", answer: "ilahi", hint: "Yeh Jawaani Hai Deewani road-trip song with Ranbir Kapoor", artist: "Arijit Singh", language: "hindi" },
  { emojis: "🌺💍❤️", answer: "tum hi ho", hint: "Aashiqui 2 most-played romantic ballad", artist: "Arijit Singh", language: "hindi" },
  { emojis: "🎭🌹💞", answer: "agar tum saath ho", hint: "Tamasha rain-soaked break-up song with Deepika and Ranbir", artist: "Alka Yagnik", language: "hindi" },
  { emojis: "🐅🥁🔥", answer: "malhari", hint: "Bajirao Mastani celebration song with Ranveer Singh dancing", artist: "Vishal Dadlani", language: "hindi" },

  // ── ENGLISH ─────────────────────────────────────────────
  { emojis: "👶✨🌟", answer: "baby", hint: "Justin Bieber's 2010 breakthrough hit with Ludacris", artist: "Justin Bieber", language: "english" },
  { emojis: "👋🌹💔", answer: "hello", hint: "Adele's 2015 ballad — 'it's me, I was wondering...'", artist: "Adele", language: "english" },
  { emojis: "👁️🐯🔥", answer: "eye of the tiger", hint: "Rocky III boxing-training anthem by Survivor", artist: "Survivor", language: "english" },
  { emojis: "💃🎶👑", answer: "dance monkey", hint: "Australian artist Tones and I's 2019 viral hit", artist: "Tones and I", language: "english" },
  { emojis: "🌙🚶‍♂️", answer: "moonwalk", aliases: ["billie jean"], hint: "Michael Jackson's signature move debuted with this 1982 hit", artist: "Michael Jackson", language: "english" },
  { emojis: "🍦🚗🌅", answer: "shape of you", hint: "Ed Sheeran's most-streamed song from Divide album", artist: "Ed Sheeran", language: "english" },
  { emojis: "🌧️🎤💜", answer: "purple rain", hint: "Prince's iconic 1984 power ballad", artist: "Prince", language: "english" },
  { emojis: "🚀🌌👨‍🚀", answer: "rocket man", hint: "Elton John's classic about a lonely astronaut", artist: "Elton John", language: "english" },
  { emojis: "🍀🌈🦄", answer: "lucky", hint: "Britney Spears ballad about a sad Hollywood star", artist: "Britney Spears", language: "english" },
  { emojis: "❤️🩹🎵", answer: "bad habits", hint: "Ed Sheeran 2021 dance-pop comeback single", artist: "Ed Sheeran", language: "english" },
  { emojis: "🦋💋🌹", answer: "butterfly kisses", hint: "1997 Bob Carlisle father-daughter ballad", artist: "Bob Carlisle", language: "english" },
  { emojis: "🌌👽🎤", answer: "starboy", hint: "The Weeknd's Daft Punk collaboration", artist: "The Weeknd", language: "english" },
  { emojis: "🔥🌶️💃", answer: "hot stuff", hint: "Donna Summer's 1979 disco classic", artist: "Donna Summer", language: "english" },
  { emojis: "🐻🌲🎸", answer: "bear necessities", aliases: ["the bare necessities"], hint: "Jungle Book Disney song sung by Baloo", artist: "Phil Harris", language: "english" },
  { emojis: "🎄🔔❄️", answer: "jingle bells", hint: "Most-known Christmas carol about dashing through snow", artist: "Traditional", language: "english" },

  // ── PUNJABI ─────────────────────────────────────────────
  { emojis: "🚜🌾🥁", answer: "tractor", aliases: ["288 tractor"], hint: "Diljit Dosanjh song about a powerful farm vehicle, '288'", artist: "Diljit Dosanjh", language: "punjabi" },
  { emojis: "👑🦁🔥", answer: "lehanga", hint: "Jass Manak romantic Punjabi hit about a girl's dress", artist: "Jass Manak", language: "punjabi" },
  { emojis: "💃👰🎉", answer: "laembadgini", hint: "Diljit Dosanjh's hit song that puns on a famous supercar brand", artist: "Diljit Dosanjh", language: "punjabi" },
  { emojis: "🎤🐍🔫", answer: "295", hint: "Sidhu Moose Wala's Punjabi hit named after an IPC section", artist: "Sidhu Moose Wala", language: "punjabi" },
  { emojis: "❤️🥺💍", answer: "qismat", hint: "Ammy Virk romantic Punjabi film title song", artist: "Ammy Virk", language: "punjabi" },
  { emojis: "👰🎉💖", answer: "suit suit", hint: "Guru Randhawa Punjabi-Bollywood crossover hit", artist: "Guru Randhawa", language: "punjabi" },
  { emojis: "🚗🛣️💨", answer: "g wagon", aliases: ["gwagon"], hint: "Sidhu Moose Wala song about a Mercedes SUV", artist: "Sidhu Moose Wala", language: "punjabi" },
  { emojis: "💔🌧️🌹", answer: "qismat 2", hint: "Sequel to Ammy Virk's heartbreak hit", artist: "Ammy Virk", language: "punjabi" },
  { emojis: "👀🌶️💃", answer: "patola", hint: "Guru Randhawa song meaning 'beautiful girl' in Punjabi", artist: "Guru Randhawa", language: "punjabi" },
  { emojis: "🐎👑🔥", answer: "so high", hint: "Sidhu Moose Wala's debut hit single from 2017", artist: "Sidhu Moose Wala", language: "punjabi" },
  { emojis: "🌹💕🎤", answer: "lehnga", aliases: ["lehanga"], hint: "Jass Manak's wedding-themed romantic song", artist: "Jass Manak", language: "punjabi" },
  { emojis: "🎶🎓👨‍👨‍👦", answer: "brown munde", hint: "AP Dhillon Punjabi anthem about brown-skinned boys abroad", artist: "AP Dhillon", language: "punjabi" },
  { emojis: "💍❤️👰", answer: "shadaa", hint: "Diljit Dosanjh Punjabi film title song about staying single", artist: "Diljit Dosanjh", language: "punjabi" },
  { emojis: "💸💎🚘", answer: "sip sip", hint: "Garry Sandhu's catchy 2018 Punjabi club hit", artist: "Garry Sandhu", language: "punjabi" },
  { emojis: "🌙💔🥀", answer: "kya baat ay", hint: "Harrdy Sandhu Punjabi-Hindi crossover romantic hit", artist: "Harrdy Sandhu", language: "punjabi" },
];

export const songLanguages = ["hindi", "english", "punjabi"] as const;
export type SongLanguage = typeof songLanguages[number];

export function getSongsByLanguage(lang: SongLanguage): SongPuzzle[] {
  return songs.filter((s) => s.language === lang);
}

export const allSongs = songs;
