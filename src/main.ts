import "./style.css";
import {
  type BoardModel,
  BoardViewComponent,
  type ClickedBoardEvent,
  type PlayerBoardModel,
} from "./view/board.ts";
import { DiceViewComponent } from "./view/dice.ts";
import type { DefineComponentFunc } from "./view/index.ts";
import { ItemsViewComponent, type ItemsViewModel } from "./view/items.ts";
import { getMap } from "./view/map.ts";

const customComponents: DefineComponentFunc[] = [
  DiceViewComponent.define,
  BoardViewComponent.define,
];

customComponents.forEach((c) => c(customElements));

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <dice-component></dice-component>
    <board-component></board-component>
    <div id="items-component"></div>
  </div>
`;

const players: { [id: string]: PlayerBoardModel } = {
  p0: { id: "p0", position: [0, 0], asset: 0 },
  p1: { id: "p1", position: [1, 0], asset: 1 },
  p2: { id: "p2", position: [2, 0], asset: 2 },
  p3: { id: "p3", position: [0, 17], asset: 3 },
  p4: { id: "p4", position: [7, 24], asset: 4 },
  p5: { id: "p5", position: [24, 18], asset: 5 },
  p6: { id: "p6", position: [24, 6], asset: 6 },
  p7: { id: "p7", position: [15, 0], asset: 7 },
  p8: { id: "p8", position: [8, 0], asset: 8 },
};

const map = getMap();

const boardModel: BoardModel = {
  players: Object.values(players),
  selection: [],
  highlight: findNearValidPlayerBlock(
    players.p8.position[0],
    players.p8.position[1],
  ).map((
    [x, y],
  ) => ({ position: [x, y] })),
};
const boardComponent = document.querySelector<BoardViewComponent>(
  "board-component",
);
boardComponent!.updateModel(
  boardModel,
);

boardComponent?.addEventListener(
  "blockclicked",
  (event) => {
    const pos = (event as CustomEvent<ClickedBoardEvent>).detail.position;
    const [x, y] = pos;
    console.log("X, Y", x, y);
    if (
      !boardModel.highlight.map((b) => b.position).find(([xh, yh]) =>
        xh == x && yh == y
      )
    ) {
      return;
    }
    if (map[y][x] != "x" && map[y][x] != "S") {
      return;
    }
    if (
      !boardModel.selection.find((s) =>
        s.position[0] == x && s.position[1] == y
      )
    ) {
      boardModel.selection.push({ position: [x, y] });
    }
    players.p8.position = [x, y];
    boardModel.players = Object.values(players);
    boardModel.highlight = findNearBlock(pos[0], pos[1]).filter((
      [x, y],
    ) => map[y][x] != " " && !map[y][x].startsWith("M")).map((
      // ) => true).map((
      [x, y],
    ) => ({
      position: [x, y],
    }));
    boardComponent.updateModel(boardModel);
  },
);

function findNearBlock(pointX: number, pointY: number) {
  return [[1, 0], [-1, 0], [0, -1], [0, +1]]
    .filter(([x, y]) =>
      pointX + x >= 0 && pointY + y >= 0 &&
      pointX + x < map[0].length && pointY + y < map.length
    ).map(([x, y]) => [pointX + x, pointY + y]);
}

function findNearValidPlayerBlock(x: number, y: number) {
  return findNearBlock(x, y).filter((
    [x, y],
  ) => map[y][x] != " " && !map[y][x].startsWith("M"));
}

const diceComponent = document.querySelector<DiceViewComponent>(
  "dice-component",
)!;
diceComponent.addEventListener("rolldice", (e) => {
  console.log("roll dice", e);
  const value = Math.floor(Math.random() * 100 % 12 + 1);
  diceComponent.update({ dice: value });
});

const itemsModel: ItemsViewModel = {
  players: [
    { label: "pl1" },
    { label: "pl2" },
    { label: "pl3" },
    { label: "pl4" },
  ],
  people: [
    { label: "Miss Scarlet" },
    { label: "Professor Plum" },
    { label: "Colonnello Mustard" },
    { label: "Dottor Green" },
    { label: "Signora Bianchi" },
    { label: "Signora Peacock" },
  ],
  objects: [
    { label: "corda" },
    { label: "tubo di piombo" },
    { label: "pugnale" },
    { label: "chiave inglese" },
    { label: "candeliere" },
    { label: "rivoltella" },
  ],
  rooms: [
    { label: "Cucina" },
    { label: "Sala da ballo" },
    { label: "Serra" },
    { label: "Sala da pranzo" },
    { label: "Sala da biliardo" },
    { label: "Biblioteca" },
    { label: "Veranda" },
    { label: "Anticamera" },
    { label: "Studio" },
  ],
};

const itemsComponentElement = document.querySelector(
  "#items-component",
)!;

new ItemsViewComponent(
  itemsComponentElement,
  itemsModel,
);
