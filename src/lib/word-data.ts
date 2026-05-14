export interface WordPuzzle {
  hint: string;       // English sentence
  hindi: string;      // Hindi translation
  hintWord: string;   // one-word clue (NEVER the answer)
  answer: string;     // one-word answer
  difficulty?: 1 | 2 | 3; // for daily challenges
}

export const wordCategories: Record<string, { label: string; emoji: string; puzzles: WordPuzzle[] }> = {
  general: {
    label: "General Knowledge",
    emoji: "🌍",
    puzzles: [
      { hint: "The capital city of France, famous for the Eiffel Tower.", hindi: "फ्रांस की राजधानी, एफिल टावर के लिए प्रसिद्ध।", hintWord: "city", answer: "paris", difficulty: 1 },
      { hint: "The largest ocean on Earth.", hindi: "पृथ्वी का सबसे बड़ा महासागर।", hintWord: "water", answer: "pacific", difficulty: 1 },
      { hint: "The longest river in the world, flowing through Egypt.", hindi: "दुनिया की सबसे लंबी नदी, मिस्र से होकर बहती है।", hintWord: "river", answer: "nile", difficulty: 2 },
      { hint: "The colour you get by mixing blue and yellow.", hindi: "नीला और पीला मिलाने पर मिलने वाला रंग।", hintWord: "colour", answer: "green", difficulty: 1 },
      { hint: "The number of continents on Earth.", hindi: "पृथ्वी पर महाद्वीपों की संख्या।", hintWord: "number", answer: "seven", difficulty: 2 },
      { hint: "The currency used in Japan.", hindi: "जापान में इस्तेमाल होने वाली मुद्रा।", hintWord: "money", answer: "yen", difficulty: 3 },
    ],
  },
  cars: {
    label: "Cars",
    emoji: "🚗",
    puzzles: [
      { hint: "A German luxury brand whose logo has four linked rings.", hindi: "एक जर्मन लग्ज़री ब्रांड जिसके लोगो में चार जुड़े हुए छल्ले हैं।", hintWord: "rings", answer: "audi", difficulty: 1 },
      { hint: "An Italian sports car brand with a prancing horse logo.", hindi: "घोड़े के लोगो वाली एक इतालवी स्पोर्ट्स कार कंपनी।", hintWord: "horse", answer: "ferrari", difficulty: 1 },
      { hint: "A famous American electric car company led by Elon Musk.", hindi: "एलोन मस्क की मशहूर अमेरिकी इलेक्ट्रिक कार कंपनी।", hintWord: "electric", answer: "tesla", difficulty: 1 },
      { hint: "India's largest car maker, makers of Swift and Alto.", hindi: "भारत की सबसे बड़ी कार निर्माता कंपनी, स्विफ्ट और ऑल्टो बनाती है।", hintWord: "india", answer: "maruti", difficulty: 2 },
      { hint: "A bull-logo Italian supercar brand.", hindi: "बैल के लोगो वाली एक इतालवी सुपरकार कंपनी।", hintWord: "bull", answer: "lamborghini", difficulty: 3 },
      { hint: "Japanese brand famous for the GT-R and the Z.", hindi: "GT-R और Z के लिए मशहूर जापानी कार ब्रांड।", hintWord: "japan", answer: "nissan", difficulty: 3 },
    ],
  },
  cartoons: {
    label: "Cartoons",
    emoji: "🧸",
    puzzles: [
      { hint: "A small boy who lives in Jhalawar with his family and dog Kutta.", hindi: "एक छोटा लड़का जो अपने परिवार और कुत्ते के साथ रहता है, बहुत मशहूर भारतीय कार्टून।", hintWord: "indian", answer: "shinchan", difficulty: 1 },
      { hint: "A yellow sponge who lives in a pineapple under the sea.", hindi: "एक पीला स्पंज जो समुद्र के नीचे अनानास में रहता है।", hintWord: "yellow", answer: "spongebob", difficulty: 1 },
      { hint: "A blue robotic cat from the future who helps Nobita.", hindi: "भविष्य से आया एक नीला रोबोट बिल्ला जो नोबिता की मदद करता है।", hintWord: "blue", answer: "doraemon", difficulty: 1 },
      { hint: "A boy who wants to be a Pokémon master, friends with Pikachu.", hindi: "एक लड़का जो पोकेमॉन मास्टर बनना चाहता है, पिकाचु का दोस्त।", hintWord: "trainer", answer: "ash", difficulty: 2 },
      { hint: "A small cat-and-mouse duo always chasing each other.", hindi: "हमेशा एक-दूसरे के पीछे भागते एक बिल्ली और एक चूहे की जोड़ी।", hintWord: "chase", answer: "tomandjerry", difficulty: 2 },
      { hint: "A boy ninja from the Hidden Leaf Village.", hindi: "हिडन लीफ गाँव का एक लड़का निंजा।", hintWord: "ninja", answer: "naruto", difficulty: 3 },
    ],
  },
  movies: {
    label: "Movies",
    emoji: "🎬",
    puzzles: [
      { hint: "A wizard boy with a lightning scar who studies at Hogwarts.", hindi: "बिजली के निशान वाला एक जादूगर लड़का जो हॉगवर्ट्स में पढ़ता है।", hintWord: "wizard", answer: "harry", difficulty: 1 },
      { hint: "An animated kingdom of ice ruled by Queen Elsa.", hindi: "रानी एल्सा द्वारा शासित बर्फ का एक एनिमेटेड साम्राज्य।", hintWord: "ice", answer: "frozen", difficulty: 1 },
      { hint: "A masked Gotham hero who fights crime at night.", hindi: "रात को अपराध से लड़ने वाला गॉथम का एक नकाबपोश हीरो।", hintWord: "gotham", answer: "batman", difficulty: 1 },
      { hint: "A Bollywood film about three engineering friends, 'All is well'.", hindi: "तीन इंजीनियरिंग दोस्तों पर बनी बॉलीवुड फिल्म, 'All is well'।", hintWord: "friends", answer: "3idiots", difficulty: 2 },
      { hint: "A green ogre who lives in a swamp with Donkey.", hindi: "गधे के साथ दलदल में रहने वाला एक हरा राक्षस।", hintWord: "swamp", answer: "shrek", difficulty: 2 },
      { hint: "A galactic war fought with lightsabers and the Force.", hindi: "लाइटसेबर और फ़ोर्स के साथ लड़ी जाने वाली एक आकाशगंगा युद्ध श्रृंखला।", hintWord: "galaxy", answer: "starwars", difficulty: 3 },
    ],
  },
};

export const categoryKeys = Object.keys(wordCategories);

// Flatten for daily challenge selection
export const allPuzzles: WordPuzzle[] = Object.values(wordCategories).flatMap((c) => c.puzzles);
