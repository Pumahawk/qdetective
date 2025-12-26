import type { Targets } from "./dto.ts";

export type CardType = "item" | "person" | "room";

interface CardBase<T> {
  type: T;
  assetId: number;
  name: string;
}

type CardT = RoomCard | ItemCard | PersonCard;
export type Card = CardT & { id: number };

export interface ItemCard extends CardBase<"item"> {
}

export interface PersonCard extends CardBase<"person"> {
}

export interface RoomCard extends CardBase<"room"> {
  doors: [number, number][];
}

const rooms: RoomCard[] = [
  {
    type: "room",
    assetId: 3,
    name: "Cucina",
    doors: [
      [6, 19],
    ],
  },
  {
    type: "room",
    assetId: 7,
    name: "Serra",
    doors: [
      [18, 9],
      [23, 11],
    ],
  },
  {
    type: "room",
    assetId: 2,
    name: "Sala da pranzo",
    doors: [
      [7, 12],
      [6, 15],
    ],
  },
  {
    type: "room",
    assetId: 5,
    name: "Sala da biliardo",
    doors: [
      [17, 15],
      [21, 13],
    ],
  },
  {
    type: "room",
    assetId: 1,
    name: "Biblioteca",
    doors: [
      [5, 6],
    ],
  },
  {
    type: "room",
    assetId: 6,
    name: "Ingresso",
    doors: [
      [8, 5],
      [9, 6],
      [15, 6],
      [16, 5],
    ],
  },
  {
    type: "room",
    assetId: 4,
    name: "Studio",
    doors: [
      [20, 5],
    ],
  },
  {
    type: "room",
    assetId: 8,
    name: "Camera da letto",
    doors: [
      [5, 6],
    ],
  },
  {
    type: "room",
    assetId: 0,
    name: "Soggiorno",
    doors: [
      [11, 18],
      [12, 18],
      [13, 18],
      [15, 19],
    ],
  },
];

const cards: CardT[] = [
  { type: "item", assetId: 13 * 7 + 3, name: "La corda" },
  { type: "item", assetId: 13 * 12 + 0, name: "Il tubo di piombo" },
  { type: "item", assetId: 13 * 8 + 0, name: "Il pugnale" },
  { type: "item", assetId: 13 * 4 + 10, name: "Veleno" },
  { type: "item", assetId: 13 * 6 + 0, name: "Mattone" },
  { type: "item", assetId: 13 * 9 + 11, name: "Arco" },

  { type: "person", assetId: 0, name: "Miss Scarlett" },
  { type: "person", assetId: 1, name: "Colonel Mustard" },
  { type: "person", assetId: 2, name: "Mrs. White" },
  { type: "person", assetId: 3, name: "Reverend Green" },
  { type: "person", assetId: 4, name: "Mrs. Peacock" },
  { type: "person", assetId: 5, name: "Professor Plum" },

  ...rooms,
];

export type Deck = number[];

export function prepareStartingDeckGameState(
  players: number,
): {
  target: Targets;
  decks: Deck[];
} {
  const cardsId = cards.map((c, i) => ({ ...c, id: i }));
  const items = shuffle(cardsId.filter((c) => c.type === "item"));
  const rooms = shuffle(cardsId.filter((c) => c.type === "room"));
  const people = shuffle(cardsId.filter((c) => c.type === "person"));

  const target: Targets = [
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
    id,
  };
}

export function getAllCards(): Card[] {
  return cards.map((c, id) => ({
    ...c,
    id,
  }));
}

function shuffle<T>(list: T[]): T[] {
  const res = [...list];
  for (let i = list.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [res[i], res[rand]] = [res[rand], res[i]];
  }
  return res;
}

export function findRoomByPosition(x: number, y: number): Card | undefined {
  return getAllCards().find((c) =>
    c.type === "room" &&
    (c as RoomCard).doors.find(([xp, yp]) => xp === x && yp === y)
  );
}
