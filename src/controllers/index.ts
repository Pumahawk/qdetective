import type { AppModel } from "../view/app.ts";
import { type GameService } from "../services/index.ts";
import { getMap } from "../view/map.ts";
import type { BlockBoardMeta } from "../view/board.ts";

export class AppController {
  gameService: GameService;
  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  rollDice(): AppModel {
    const dice = Math.floor(Math.random() * 100) % 12 + 1;
    const appModel = this.gameService.getAppModel();
    appModel.movements = dice;
    return appModel;
  }

  movePlayer(x: number, y: number): AppModel {
    console.log("X, Y", x, y);
    const appModel = this.gameService.getAppModel();
    const boardModel = appModel.boardModel;
    const map = getMap();
    const activePlayer = appModel.activePlayer;

    if (appModel.movements <= 0) {
      return appModel;
    }

    if (
      !((x == activePlayer.position[0] &&
        Math.abs(y - activePlayer.position[1]) == 1) ||
        (y == activePlayer.position[1] &&
          Math.abs(x - activePlayer.position[0]) == 1))
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
    appModel.activePlayer.position = [x, y];
    appModel.movements--;
    boardModel.highlight = appModel.movements > 0
      ? findNearBlockBoard(map, x, y)
      : [];
    return appModel;
  }

  startMoveFase(): AppModel {
    const appModel = this.gameService.getAppModel();
    const boardModel = appModel.boardModel;
    appModel.playFase = "move";
    boardModel.highlight = findNearBlockBoard(
      getMap(),
      appModel.activePlayer.position[0],
      appModel.activePlayer.position[1],
    );
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
