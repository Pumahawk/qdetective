import type { PlayerBoardModel } from "../view/board.ts";
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
  getAppModel(): AppModel;
  initItemComponentModel(): ItemsViewModel;
  getActivePlayer(id: string): PlayerBoardModel;
}

export class GameServiceImpl implements GameService {
  appModel: AppModel = {
    callPlayerId: null,
    activePlayerId: plsm.p8.id,
    itemSelected: null,
    itemShowed: null,
    itemsToShow: [],

    diceModel: {
      dice: 0,
    },

    boardModel: {
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
    },

    gameFase: "play",
    playFase: "dice",
    showItems: false,
    movements: 12,

    items: {
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
    },
  };
  map = getMap();
  activePlayer = plsm.p8;

  getAppModel(): AppModel {
    return this.appModel;
  }

  initItemComponentModel(): ItemsViewModel {
    return this.appModel.items;
  }

  getActivePlayer(id: string): PlayerBoardModel {
    const activePlayer = Object.values(plsm).find((p) => p.id == id);
    if (!activePlayer) {
      throw new Error("invalid error player id: " + id);
    }
    return activePlayer;
  }
}

// function findNearValidPlayerBlock(map: string[][], x: number, y: number) {
//   return findNearBlock(map, x, y).filter((
//     [x, y],
//   ) => map[y][x] != " " && !map[y][x].startsWith("M"));
// }
