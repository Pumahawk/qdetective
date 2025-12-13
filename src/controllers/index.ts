import type { AppModel } from "../view/app.ts";
import { type GameService } from "../services/index.ts";
import { getMap } from "../view/map.ts";
import type { BlockBoardMeta } from "../view/board.ts";
import type { ConfirmDataItemSelection } from "../view/items.ts";

export class AppController {
  gameService: GameService;
  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  rollDice(): AppModel {
    const dice = Math.floor(Math.random() * 100) % 11 + 2;
    const appModel = this.gameService.getAppModel();
    appModel.movements = dice;
    appModel.diceModel = { dice };
    this.startMoveFase();
    return appModel;
  }

  clickOnBoard(x: number, y: number): AppModel {
    const appModel = this.gameService.getAppModel();
    if (isMoveFase(appModel)) {
      const movedlPlayerModel = this.movePlayer(x, y);
      if (movedlPlayerModel.movements == 0) {
        return this.startSelectionItemFase();
      }
    }
    return appModel;
  }

  submitItemSelection(selectedItems: ConfirmDataItemSelection): AppModel {
    const appModel = this.gameService.getAppModel();
    if (isSelectionFase(appModel)) {
      appModel.itemSelected = {
        person: selectedItems.person.label,
        object: selectedItems.object.label,
        room: selectedItems.room.label,
      };
      console.log("Set items.", appModel.itemSelected);
    }
    return appModel;
  }

  movePlayer(x: number, y: number): AppModel {
    console.log("X, Y", x, y);
    const appModel = this.gameService.getAppModel();
    const boardModel = appModel.boardModel;
    const map = getMap();

    const activePlayer = this.gameService.getActivePlayer(
      appModel.activePlayerId,
    );
    if (!activePlayer) {
      throw new Error("invalid error player id: " + appModel.activePlayerId);
    }

    if (appModel.movements <= 0) {
      return appModel;
    }

    if (
      Math.abs(y - activePlayer.position[1]) +
          Math.abs(x - activePlayer.position[0]) != 1
    ) {
      return appModel;
    }
    if (map[y][x] != "x" && map[y][x] != "S") {
      return appModel;
    }

    if (
      !boardModel.selection.find((s) =>
        s.position[0] == x && s.position[1] == y
      )
    ) {
      boardModel.selection.push({ position: [x, y] });
    }
    activePlayer.position = [x, y];
    appModel.movements--;
    boardModel.highlight = findHighlightBlock(appModel, map, x, y);
    return appModel;
  }

  startMoveFase(): AppModel {
    const appModel = this.gameService.getAppModel();
    const boardModel = appModel.boardModel;
    const activePlayer = this.gameService.getActivePlayer(
      appModel.activePlayerId,
    );
    appModel.playFase = "move";
    boardModel.highlight = findNearBlockBoard(
      getMap(),
      activePlayer.position[0],
      activePlayer.position[1],
    );
    return appModel;
  }

  startSelectionItemFase(): AppModel {
    const appModel = this.gameService.getAppModel();
    appModel.playFase = "call";
    return appModel;
  }
}

function findNearBlock(map: string[][], pointX: number, pointY: number) {
  return [[1, 0], [-1, 0], [0, -1], [0, +1]]
    .filter(([x, y]) =>
      pointX + x >= 0 && pointY + y >= 0 &&
      pointX + x < map[0].length && pointY + y < map.length
    ).map(([x, y]) => [pointX + x, pointY + y]);
}

function findNearBlockBoard(
  map: string[][],
  x: number,
  y: number,
): BlockBoardMeta[] {
  return findNearBlock(map, x, y).filter(
    (
      [x, y],
    ) => map[y][x] != " " && !map[y][x].startsWith("M"),
  ).map((
    // ) => true).map((
    [x, y],
  ) => ({
    position: [x, y],
  }));
}

function findHighlightBlock(
  appModel: AppModel,
  map: string[][],
  x: number,
  y: number,
) {
  return appModel.movements > 0 ? findNearBlockBoard(map, x, y) : [];
}

function isMoveFase(appModel: AppModel): boolean {
  return appModel.gameFase == "play" &&
    appModel.playFase == "move";
}

function isSelectionFase(appModel: AppModel) {
  return appModel.gameFase == "play" && appModel.playFase == "call";
}
