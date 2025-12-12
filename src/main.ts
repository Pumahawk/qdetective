import { AppController } from "./controllers/index.ts";
import { GameServiceImpl } from "./services/index.ts";
import "./style.css";
import { AppComponenF } from "./view/app.ts";
import { BoardViewComponentF } from "./view/board.ts";
import { DiceViewComponentF } from "./view/dice.ts";
import {
  ItemSelectionViewComponentF,
  ItemsViewComponentF,
} from "./view/items.ts";

// const players: { [id: string]: PlayerBoardModel } = {
//   p0: { id: "p0", position: [0, 0], asset: 0 },
//   p1: { id: "p1", position: [1, 0], asset: 1 },
//   p2: { id: "p2", position: [2, 0], asset: 2 },
//   p3: { id: "p3", position: [0, 17], asset: 3 },
//   p4: { id: "p4", position: [7, 24], asset: 4 },
//   p5: { id: "p5", position: [24, 18], asset: 5 },
//   p6: { id: "p6", position: [24, 6], asset: 6 },
//   p7: { id: "p7", position: [15, 0], asset: 7 },
//   p8: { id: "p8", position: [8, 0], asset: 8 },
// };

// const appModel: AppModel = {
//   playerState: "wait",
//
//   itemSelectionModel: {
//     people: [],
//     objects: [],
//     rooms: [],
//   },
//
//   itemsViewModel: {
//     players: [
//       { label: "pl1" },
//       { label: "pl2" },
//       { label: "pl3" },
//       { label: "pl4" },
//     ],
//     people: [],
//     objects: [
//       { label: "corda" },
//       { label: "tubo di piombo" },
//       { label: "pugnale" },
//       { label: "chiave inglese" },
//       { label: "candeliere" },
//       { label: "rivoltella" },
//     ],
//     rooms: [
//       { label: "Cucina" },
//       { label: "Sala da ballo" },
//       { label: "Serra" },
//       { label: "Sala da pranzo" },
//       { label: "Sala da biliardo" },
//       { label: "Biblioteca" },
//       { label: "Veranda" },
//       { label: "Anticamera" },
//       { label: "Studio" },
//     ],
//   },
//
//   diceViewModel: {
//     dice: null,
//   },
//
//   boardModel: {
//     players: Object.values(players),
//     selection: [],
//     highlight: findNearValidPlayerBlock(
//       getMap(),
//       players.p8.position[0],
//       players.p8.position[1],
//     ).map((
//       [x, y],
//     ) => ({ position: [x, y] })),
//   },
// };

const appElement = document.querySelector<HTMLDivElement>("#app")!;

const gameService = new GameServiceImpl();
AppComponenF(
  customElements,
  gameService,
  new AppController(gameService),
);
BoardViewComponentF(customElements);
DiceViewComponentF(customElements);
ItemsViewComponentF(customElements);
ItemSelectionViewComponentF(customElements);

appElement.innerHTML = `
<app-component></app-component>
`;

// const appComponent = document.querySelector("app-component")!;

// const map = getMap();
//
// appElement.addEventListener(
//   "blockclicked",
//   (event) => {
//     const pos = (event as CustomEvent<ClickedBoardEvent>).detail.position;
//     const [x, y] = pos;
//     console.log("X, Y", x, y);
//     if (
//       !appModel.boardModel.highlight.map((b) => b.position).find(([xh, yh]) =>
//         xh == x && yh == y
//       )
//     ) {
//       return;
//     }
//     if (map[y][x] != "x" && map[y][x] != "S") {
//       return;
//     }
//     if (
//       !appModel.boardModel.selection.find((s) =>
//         s.position[0] == x && s.position[1] == y
//       )
//     ) {
//       appModel.boardModel.selection.push({ position: [x, y] });
//     }
//     players.p8.position = [x, y];
//     appModel.boardModel.players = Object.values(players);
//     appModel.boardModel.highlight = findNearBlock(map, pos[0], pos[1]).filter((
//       [x, y],
//     ) => map[y][x] != " " && !map[y][x].startsWith("M")).map((
//       // ) => true).map((
//       [x, y],
//     ) => ({
//       position: [x, y],
//     }));
//     appComponent.update(appModel);
//   },
// );
//

// function findNearBlock(map: string[][], pointX: number, pointY: number) {
//   return [[1, 0], [-1, 0], [0, -1], [0, +1]]
//     .filter(([x, y]) =>
//       pointX + x >= 0 && pointY + y >= 0 &&
//       pointX + x < map[0].length && pointY + y < map.length
//     ).map(([x, y]) => [pointX + x, pointY + y]);
// }

// function findNearValidPlayerBlock(map: string[][], x: number, y: number) {
//   return findNearBlock(map, x, y).filter((
//     [x, y],
//   ) => map[y][x] != " " && !map[y][x].startsWith("M"));
// }

//
// appElement.addEventListener("rolldice", (e) => {
//   console.log("roll dice", e);
//   const value = Math.floor(Math.random() * 100 % 12 + 1);
//   appModel.diceViewModel = { dice: value };
//   appComponent.update(appModel);
// });
//
// appElement.addEventListener(
//   "itemselectionform",
//   (e) => {
//     const detail = (e as CustomEvent<ConfirmDataItemSelectionComponent>).detail;
//     console.log("Item selected event component", e, detail);
//   },
// );
