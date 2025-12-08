import { getMap } from "./map.ts";

export interface BoardModel {
  players: PlayerBoardModel[];
  selection: BlockBoardSelection[];
}

export interface BlockBoardSelection {
  position: [number, number];
}

export interface PlayerBoardModel {
  id: string;
  position: [number, number];
  asset: BoardPlayerAssetEnum;
}

export type BoardPlayerAssetEnum = "red";

export interface ClickedBoardEvent {
  position: [number, number];
}

export class BoardViewComponent extends HTMLElement {
  blockSize = 16;
  boardSizeX = 25 * this.blockSize;
  boardSizeY = 25 * this.blockSize;

  shadow: ShadowRoot;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  model?: BoardModel;

  static define(ce: CustomElementRegistry) {
    ce.define("board-component", BoardViewComponent);
  }

  updateModel(model: BoardModel) {
    this.model = model;
  }

  constructor() {
    super();

    this.model = undefined;

    this.shadow = this.attachShadow({ mode: "open" });

    this.canvas = document.createElement("canvas") as HTMLCanvasElement;

    this.canvas.width = this.boardSizeX;
    this.canvas.height = this.boardSizeY;
    this.canvas.style.width = "1000px";
    this.canvas.style.height = "1000px";
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.addEventListener("click", (e) => this.handleClickOnCanvas(e));

    this.ctx = this.canvas.getContext("2d")!;

    this.shadow.appendChild(this.canvas);
  }

  async connectedCallback() {
    const assets = new Image();
    assets.src = "/assets.png";
    const rooms = new Image();
    rooms.src = "/rooms.png";

    const asm = new AssetManager(this.ctx, assets, rooms);

    await Promise.all([assets.decode(), rooms.decode()]);

    asm.drawBoard();
  }

  private dispatchBlockClick(x: number, y: number) {
    const event = new CustomEvent<ClickedBoardEvent>("blockclicked", {
      detail: {
        position: [x, y],
      },
    });
    this.dispatchEvent(event);
  }

  private handleClickOnCanvas(event: MouseEvent) {
    const cp = this.canvas.getBoundingClientRect();
    const x = Math.floor(
      (event.x - cp.x) / (this.blockSize * cp.width / this.boardSizeX),
    );
    const y = Math.floor(
      (event.y - cp.y) / (this.blockSize * cp.height / this.boardSizeY),
    );
    this.dispatchBlockClick(x, y);
  }
}

type AssetXY = [number, number, [number, number]?];
interface RoomC {
  position: [number, number];
  size: [number, number];
}

const roomSize = 330;
const roomXY = {
  kitchen: { position: [330 * 0, 330 * 0], size: [330, 330] } as RoomC,
  biblio: { position: [330 * 1, 330 * 0], size: [330, 330] } as RoomC,
  salaPranzo: { position: [330 * 2, 330 * 0], size: [330, 330] } as RoomC,

  room1: { position: [330 * 0, 330 * 1], size: [330, 330] } as RoomC,
  stud: { position: [330 * 1, 330 * 1], size: [330, 330] } as RoomC,
  gioco: {
    position: [330 * 2, 330 * 1 + roomSize / 2],
    size: [330, roomSize / 2],
  } as RoomC,

  ingr: { position: [330 * 0, 330 * 2], size: [330, 330] } as RoomC,
  giard: { position: [330 * 1, 330 * 2], size: [330, 330] } as RoomC,
  bad: { position: [330 * 2, 330 * 2], size: [330, 330] } as RoomC,

  swpool: { position: [330 * 0, 330 * 3], size: [330, 330] } as RoomC,
};

interface RoomPS {
  room: RoomC;
  position: [number, number, number, number];
}

const rooms: RoomPS[] = [
  { room: roomXY.kitchen, position: [16 * 1, 16 * 1, 16 * 6, 16 * 6] },
  { room: roomXY.biblio, position: [16 * 9, 16 * 18, 16 * 7, 16 * 6] },
  { room: roomXY.salaPranzo, position: [16 * 1, 16 * 9, 16 * 7, 16 * 7] },
  { room: roomXY.room1, position: [16 * 1, 16 * 18, 16 * 6, 16 * 6] },
  { room: roomXY.stud, position: [16 * 18, 16 * 0, 16 * 6, 16 * 7] },
  { room: roomXY.gioco, position: [16 * 17, 16 * 13, 16 * 7, 16 * 5] },
  { room: roomXY.giard, position: [16 * 18, 16 * 7, 16 * 6, 16 * 5] },
  { room: roomXY.bad, position: [16 * 18, 16 * 20, 16 * 6, 16 * 5] },
  { room: roomXY.ingr, position: [16 * 8, 16 * 0, 16 * 9, 16 * 7] },
  { room: roomXY.swpool, position: [16 * 9, 16 * 8, 16 * 7, 16 * 8] },
];

const assetsXY = {
  floor: [3, 5] as AssetXY,
  door: [5, 4] as AssetXY,
  wallW: [9, 9] as AssetXY,
  wallNW: [9, 10, [1, -1]] as AssetXY,
  wallSW: [9, 10] as AssetXY,
  wallN: [14, 11, [1, -1]] as AssetXY,
  wallS: [14, 11] as AssetXY,
  wallNE: [9, 10, [-1, -1]] as AssetXY,
  wallSE: [9, 10, [-1, 1]] as AssetXY,
  wallE: [9, 9, [-1, 1]] as AssetXY,
};

class AssetManager {
  ctx: CanvasRenderingContext2D;
  imageAssets: HTMLImageElement;
  imageRooms: HTMLImageElement;
  constructor(
    ctx: CanvasRenderingContext2D,
    imageAssets: HTMLImageElement,
    imageRooms: HTMLImageElement,
  ) {
    this.ctx = ctx;
    this.imageAssets = imageAssets;
    this.imageRooms = imageRooms;
  }

  drawAsset(asset: AssetXY, x: number, y: number) {
    const [px, py, scale] = asset;
    const bs = 16;
    if (scale) {
      this.ctx.save();
      this.ctx.translate(x * bs + bs / 2, y * bs + bs / 2);
      this.ctx.scale(scale[0], scale[1]);
      this.ctx.drawImage(
        this.imageAssets,
        px * bs,
        py * bs,
        bs,
        bs,
        -bs / 2,
        -bs / 2,
        bs,
        bs,
      );
      this.ctx.restore();
    } else {
      this.ctx.drawImage(
        this.imageAssets,
        px * bs,
        py * bs,
        bs,
        bs,
        x * bs,
        y * bs,
        bs,
        bs,
      );
    }
  }

  drawBoard() {
    rooms.forEach((room) => this.drawRoom(room.room, room.position));
    getMap().forEach((row, i) =>
      row.forEach((cell, j) => {
        switch (cell) {
          case " ":
            break;
          case "ML":
            this.drawAsset(assetsXY.wallW, j, i);
            break;
          case "MNW":
            this.drawAsset(assetsXY.wallNW, j, i);
            break;
          case "MSW":
            this.drawAsset(assetsXY.wallSW, j, i);
            break;
          case "MN":
            this.drawAsset(assetsXY.wallN, j, i);
            break;
          case "MS":
            this.drawAsset(assetsXY.wallS, j, i);
            break;
          case "MNE":
            this.drawAsset(assetsXY.wallNE, j, i);
            break;
          case "MSE":
            this.drawAsset(assetsXY.wallSE, j, i);
            break;
          case "ME":
            this.drawAsset(assetsXY.wallE, j, i);
            break;
          case "S":
            this.drawAsset(assetsXY.door, j, i);
            break;
          default:
            this.drawAsset(assetsXY.floor, j, i);
            break;
        }
        if (cell == "x") {
          this.drawAsset(assetsXY.floor, j, i);
        }
      })
    );
  }

  drawRoom(room: RoomC, coordinates: [number, number, number, number]) {
    const [positionX, positionY] = room.position;
    const [x, y] = room.size;
    const [cx, cy, cdx, cdy] = coordinates;
    this.ctx.drawImage(
      this.imageRooms,
      positionX,
      positionY,
      x,
      y,
      cx,
      cy,
      cdx,
      cdy,
    );
  }
}
