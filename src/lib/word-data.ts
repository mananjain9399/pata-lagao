export interface WordPuzzle {
  hint: string;
  answer: string;
}

export const wordCategories: Record<string, { label: string; emoji: string; puzzles: WordPuzzle[] }> = {
  movies: {
    label: "Movies & TV",
    emoji: "🎬",
    puzzles: [
      { hint: "A wizard boy with a lightning scar attends a magical school.", answer: "harry" },
      { hint: "An animated kingdom of ice ruled by Elsa, the queen of winter.", answer: "frozen" },
      { hint: "A masked vigilante of Gotham who fears bats no more.", answer: "batman" },
      { hint: "A galactic war fought with lightsabers and the Force.", answer: "starwars" },
      { hint: "A clownfish father searches the ocean for his lost son.", answer: "nemo" },
      { hint: "A green ogre living in a swamp finds love with a princess.", answer: "shrek" },
    ],
  },
  sports: {
    label: "Sports",
    emoji: "⚽",
    puzzles: [
      { hint: "A sport played on grass with 11 players, a round ball and two goals.", answer: "football" },
      { hint: "A racquet game played at Wimbledon on grass courts.", answer: "tennis" },
      { hint: "A bat-and-ball game with overs, wickets and runs.", answer: "cricket" },
      { hint: "A pool sport where players score by throwing a ball into a netted hoop above water.", answer: "waterpolo" },
      { hint: "A board sport ridden on snowy mountains.", answer: "snowboarding" },
      { hint: "An indoor game with a hoop, a dribble and a three-point line.", answer: "basketball" },
    ],
  },
  tech: {
    label: "Science & Tech",
    emoji: "🔬",
    puzzles: [
      { hint: "The chemical symbol H2O describes this everyday liquid.", answer: "water" },
      { hint: "The closest star to Earth that lights up our days.", answer: "sun" },
      { hint: "A global network of computers sharing information.", answer: "internet" },
      { hint: "A device you carry that makes calls, takes photos and runs apps.", answer: "smartphone" },
      { hint: "The branch of computing that lets machines learn from data.", answer: "ai" },
      { hint: "A red planet, fourth from the sun, often called Earth's neighbor.", answer: "mars" },
    ],
  },
  music: {
    label: "Music",
    emoji: "🎵",
    puzzles: [
      { hint: "A six-stringed instrument used in rock and acoustic ballads.", answer: "guitar" },
      { hint: "A black-and-white keyed instrument played in classical music.", answer: "piano" },
      { hint: "The British band of John, Paul, George and Ringo.", answer: "beatles" },
      { hint: "A type of music born from African American communities, blending blues and ragtime.", answer: "jazz" },
      { hint: "A unit of musical time you tap your foot to.", answer: "beat" },
      { hint: "A solo singer\u2019s recorded vocal track on a song.", answer: "vocals" },
    ],
  },
  food: {
    label: "Food",
    emoji: "🍕",
    puzzles: [
      { hint: "An Italian flatbread topped with tomato, cheese and toppings.", answer: "pizza" },
      { hint: "A Japanese dish of vinegared rice, often topped with raw fish.", answer: "sushi" },
      { hint: "A long yellow fruit that monkeys love.", answer: "banana" },
      { hint: "A dark sweet treat made from cocoa beans.", answer: "chocolate" },
      { hint: "A bread pocket filled with meat or veggies, common in Mexican cuisine.", answer: "taco" },
      { hint: "A morning drink made from roasted beans, often with milk and sugar.", answer: "coffee" },
    ],
  },
  animals: {
    label: "Animals & Nature",
    emoji: "🐯",
    puzzles: [
      { hint: "Striped orange big cat, the national animal of India.", answer: "tiger" },
      { hint: "The largest mammal on Earth, lives in the ocean.", answer: "whale" },
      { hint: "A bird that cannot fly, lives in Antarctica and waddles on ice.", answer: "penguin" },
      { hint: "A long-necked African mammal that eats leaves from tall trees.", answer: "giraffe" },
      { hint: "A small insect that produces honey and lives in colonies.", answer: "bee" },
      { hint: "A rainforest in South America, the lungs of the planet.", answer: "amazon" },
    ],
  },
  general: {
    label: "General Knowledge",
    emoji: "🌍",
    puzzles: [
      { hint: "The capital city of France, famous for the Eiffel Tower.", answer: "paris" },
      { hint: "The currency of Japan.", answer: "yen" },
      { hint: "The longest river in the world, flowing through Egypt.", answer: "nile" },
      { hint: "The number of continents on Earth.", answer: "seven" },
      { hint: "The color you get by mixing blue and yellow.", answer: "green" },
      { hint: "The largest ocean on Earth.", answer: "pacific" },
    ],
  },
};

export const categoryKeys = Object.keys(wordCategories);
