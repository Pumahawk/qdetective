type CardType = "item" | "room" | "person";

interface CardBase {
  type: CardType;
  assetId: number;
  name: string;
}

export interface Card extends CardBase {
  id: number;
}

const cards: CardBase[] = [
  { type: "item", assetId: 0, name: "La corda" },
  { type: "item", assetId: 0, name: "Il tubo di piombo" },
  { type: "item", assetId: 0, name: "Il pugnale" },
  { type: "item", assetId: 0, name: "Veleno" },
  { type: "item", assetId: 0, name: "Mattone" },
  { type: "item", assetId: 0, name: "Arco" },

  { type: "person", assetId: 0, name: "Miss Scarlett" },
  { type: "person", assetId: 0, name: "Colonel Mustard" },
  { type: "person", assetId: 0, name: "Mrs. White" },
  { type: "person", assetId: 0, name: "Reverend Green" },
  { type: "person", assetId: 0, name: "Mrs. Peacock" },
  { type: "person", assetId: 0, name: "Professor Plum" },

  { type: "room", assetId: 0, name: "Cucina" },
  { type: "room", assetId: 0, name: "Sala da ballo" },
  { type: "room", assetId: 0, name: "Serra" },
  { type: "room", assetId: 0, name: "Sala da pranzo" },
  { type: "room", assetId: 0, name: "Sala da biliardo" },
  { type: "room", assetId: 0, name: "Biblioteca" },
  { type: "room", assetId: 0, name: "Ingresso" },
  { type: "room", assetId: 0, name: "Studio" },
  { type: "room", assetId: 0, name: "Camera da letto" },
];

export type Deck = number[];

type Target = number[];

export function prepareStartingDeckGameState(
  players: number,
): {
  target: Target;
  decks: Deck[];
} {
  const cardsId = cards.map((c, i) => ({ ...c, id: i }));
  const items = shuffle(cardsId.filter((c) => c.type === "item"));
  const rooms = shuffle(cardsId.filter((c) => c.type === "room"));
  const people = shuffle(cardsId.filter((c) => c.type === "person"));

  const target: Target = [
    items.pop()!.id,
    rooms.pop()!.id,
    people.pop()!.id,
  ];

  const randomCards = shuffle([...items, ...rooms, ...people]);

  const decks: Deck[] = [];
  for (let i = 0; i < players; i++) {
    decks.push([]);
  }

  randomCards.forEach((c, i) => {
    decks[Math.floor(i * players / randomCards.length)].push(c.id);
  });

  return {
    target,
    decks,
  };
}

export function getCardById(id: number): Card {
  return {
    ...cards[id],
    id: id,
  };
}

function shuffle<T>(list: T[]): T[] {
  const res = [...list];
  for (let i = list.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [res[i], res[rand]] = [res[rand], res[i]];
  }
  return res;
}
