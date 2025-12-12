import type { BoardModel, PlayerBoardModel } from "../view/board.ts";
import type { AppModel } from "../view/app.ts";
import type { ItemsViewModel } from "../view/items.ts";
import { getMap } from "../view/map.ts";

const plsm: { [id: string]: PlayerBoardModel } = {
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

export interface GameService {
  initBoardModel(): BoardModel;
  getStartingGame(): AppModel;
  initItemComponentModel(): ItemsViewModel;
  rollDice(): number;
  movePlayer(x: number, y: number): BoardModel;
}

export class GameServiceImpl implements GameService {
  map = getMap();
  activePlayer = plsm.p8;
  boardModel: BoardModel = {
    highlight: [],
    players: [
      plsm.p0,
      plsm.p1,
      plsm.p2,
      plsm.p3,
      plsm.p4,
      plsm.p5,
      plsm.p6,
      plsm.p7,
      plsm.p8,
    ],
    selection: [],
  };
  initBoardModel(): BoardModel {
    return this.boardModel;
  }

  getStartingGame(): AppModel {
    return {
      gameFase: "play",
      playFase: "dice",
      showItems: false,
      movements: 12,
    };
  }

  initItemComponentModel(): ItemsViewModel {
    return {
      players: [
        { label: "pl1" },
        { label: "pl2" },
        { label: "pl3" },
        { label: "pl4" },
      ],
      people: [],
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
  }

  rollDice(): number {
    return Math.floor(Math.random() * 100) % 12 + 1;
  }

  movePlayer(x: number, y: number): BoardModel {
    console.log("X, Y", x, y);
    const boardModel = this.boardModel;

    if (this.map[y][x] != "x" && this.map[y][x] != "S") {
      return boardModel;
    }
    if (
      !boardModel.selection.find((s) =>
        s.position[0] == x && s.position[1] == y
      )
    ) {
      boardModel.selection.push({ position: [x, y] });
    }
    this.activePlayer.position = [x, y];
    boardModel.highlight = findNearBlock(this.map, x, y).filter(
      (
        [x, y],
      ) => this.map[y][x] != " " && !this.map[y][x].startsWith("M"),
    ).map((
      // ) => true).map((
      [x, y],
    ) => ({
      position: [x, y],
    }));
    return boardModel;
  }
}

function findNearBlock(map: string[][], pointX: number, pointY: number) {
  return [[1, 0], [-1, 0], [0, -1], [0, +1]]
    .filter(([x, y]) =>
      pointX + x >= 0 && pointY + y >= 0 &&
      pointX + x < map[0].length && pointY + y < map.length
    ).map(([x, y]) => [pointX + x, pointY + y]);
}

// function findNearValidPlayerBlock(map: string[][], x: number, y: number) {
//   return findNearBlock(map, x, y).filter((
//     [x, y],
//   ) => map[y][x] != " " && !map[y][x].startsWith("M"));
// }
